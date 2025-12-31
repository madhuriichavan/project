using System.Text.Json;
using CareerX_dotnet.Model;

public class GeminiAssessmentService
    {
        // 1. Ensure this is only declared ONCE here
        private readonly HttpClient _httpClient; 
        private readonly string _apiKey;
        private const string Model = "gemini-2.5-flash"; 

        public GeminiAssessmentService(IConfiguration config)
        {
            _apiKey = config["Gemini:ApiKey"] ?? throw new Exception("API Key Missing");
            
            // 2. Initialize it here
            _httpClient = new HttpClient(); 
        }

        public async Task<List<McqQuestion>> Generate60QuestionsAsync(string profileJson)
        {
            // Note the 'v1beta' in the URL is required for response_mime_type features
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/{Model}:generateContent?key={_apiKey}";

           var prompt = $@"
        Act as an expert Career Counselor. Based on this student profile: {profileJson}
        Generate exactly 60 MCQ questions. 
        
        CRITICAL INSTRUCTIONS:
        1. Each object MUST have a non-empty 'questionText'.
        2. Questions 1-20: Logical Reasoning & Aptitude.
        3. Questions 21-40: Technical (Python, Data Analysis, Programming).
        4. Questions 41-60: Workplace Personality & Career Interests.
        5. Provide 4 distinct options and a correctOptionIndex.

        Return ONLY a JSON array of objects with these keys: 
        'id', 'questionText', 'options', 'correctOptionIndex', 'category'.";

            var payload = new {
                contents = new[] { new { parts = new[] { new { text = prompt } } } },
                generationConfig = new { response_mime_type = "application/json", max_output_tokens = 8192 } 
            };

            var response = await _httpClient.PostAsJsonAsync(url, payload);
            
            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"Gemini API Error: {error}");
            }

            var result = await response.Content.ReadFromJsonAsync<JsonElement>();
            var rawJson = result.GetProperty("candidates")[0]
                                .GetProperty("content")
                                .GetProperty("parts")[0]
                                .GetProperty("text")
                                .GetString();

            if (string.IsNullOrEmpty(rawJson))
            {
                throw new Exception("Gemini API returned empty response");
            }

            var jsonOptions = new JsonSerializerOptions 
            { 
                PropertyNameCaseInsensitive = true,
                AllowTrailingCommas = true,
                ReadCommentHandling = JsonCommentHandling.Skip
            };
            
            var questions = JsonSerializer.Deserialize<List<McqQuestion>>(rawJson, jsonOptions);
            
            if (questions == null || questions.Count == 0)
            {
                throw new Exception("Failed to deserialize questions from Gemini API response");
            }

            return questions;
        }

        public async Task<string> EvaluateResultsAsync(string questionsJson, string answersJson, string profileJson)
        {
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/{Model}:generateContent?key={_apiKey}";

            var prompt = $@"
                Profile: {profileJson}
                Test Questions: {questionsJson}
                User's Answer Indices: {answersJson}

                Analyze the performance and provide a comprehensive Career Assessment Report.
                Include: 'recommendedCareer', 'skillScore' (0-100), 'strengths', and 'weaknesses'.
                Return ONLY JSON.";

            var payload = new {
                contents = new[] { new { parts = new[] { new { text = prompt } } } },
                generationConfig = new { response_mime_type = "application/json" }
            };

            var response = await _httpClient.PostAsJsonAsync(url, payload);
            var result = await response.Content.ReadFromJsonAsync<JsonElement>();
            return result.GetProperty("candidates")[0].GetProperty("content").GetProperty("parts")[0].GetProperty("text").GetString()!;
        }
    }
