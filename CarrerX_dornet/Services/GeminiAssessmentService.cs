using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using CareerX_dotnet.Model;

namespace CareerX_dotnet.Services;

public class GeminiAssessmentService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private const string GeminiApiBaseUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    public GeminiAssessmentService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _apiKey = configuration["Gemini:ApiKey"];
    }

    public async Task<List<McqQuestion>> Generate60QuestionsAsync(string profileJson)
    {
        var prompt = $@"
        Generate 60 Multiple Choice Questions (MCQs) for a student assessment based on the following student profile:
        {profileJson}

        The questions should cover 3 categories:
        1. Logical Reasoning (20 questions)
        2. Technical/Academic Skills relevant to their education/interests (20 questions)
        3. Career & Soft Skills (20 questions)

        Format the output as a strictly valid JSON array of objects. Do not include markdown formatting (like ```json ... ```) in the response.
        Each object must have:
        - ""QuestionText"": string
        - ""Options"": array of 4 strings
        - ""CorrectOptionIndex"": integer (0-3)
        - ""Category"": string
        
        Ensure the questions are challenging and appropriate for the student's level.
        ";

        var response = await CallGeminiApi(prompt);
        
        try 
        {
            // Clean markdown if present
            var cleanJson = CleanupJson(response);
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            return JsonSerializer.Deserialize<List<McqQuestion>>(cleanJson, options) ?? new List<McqQuestion>();
        }
        catch(Exception ex)
        {
            Console.WriteLine($"Error parsing Gemini response: {ex.Message}");
            // Fallback or retry could be implemented here
             throw new Exception("Failed to parse generated questions", ex);
        }
    }

    public async Task<string> EvaluateResultsAsync(string questionsJson, string answersJson, string profileJson)
    {
        var prompt = $@"
        Analyze the following student assessment results and provide career recommendations.
        
        Student Profile:
        {profileJson}

        Questions:
        {questionsJson}

        Student Answers (indices):
        {answersJson}

        Please provide a comprehensive analysis in strict JSON format (no markdown). The JSON should have the following structure:
        {{
            ""recommendedCareer"": ""Primary Career Path Recommendation"",
            ""skillScore"": 85 (integer 0-100 based on correct answers and difficulty),
            ""strengths"": [""Strength 1"", ""Strength 2""],
            ""weaknesses"": [""Weakness 1"", ""Weakness 2""],
            ""careerRoadmap"": {{
                ""shortTerm"": ""Steps for next 6 months"",
                ""mediumTerm"": ""Steps for 1-2 years"",
                ""longTerm"": ""5 year goal""
            }},
            ""suggestedCourses"": [""Course 1"", ""Course 2""],
            ""suggestedColleges"": [""College 1"", ""College 2""]
        }}
        ";

        var response = await CallGeminiApi(prompt);
        return CleanupJson(response);
    }

    private async Task<string> CallGeminiApi(string prompt)
    {
        var requestBody = new
        {
            contents = new[]
            {
                new { parts = new[] { new { text = prompt } } }
            }
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync($"{GeminiApiBaseUrl}?key={_apiKey}", content);
        response.EnsureSuccessStatusCode();

        var responseString = await response.Content.ReadAsStringAsync();
        using var document = JsonDocument.Parse(responseString);
        
        // Extract text from Gemini response structure
        // Root -> candidates[0] -> content -> parts[0] -> text
        if (document.RootElement.TryGetProperty("candidates", out var candidates) && candidates.GetArrayLength() > 0)
        {
            var candidate = candidates[0];
            if (candidate.TryGetProperty("content", out var contentJson) && 
                contentJson.TryGetProperty("parts", out var parts) && 
                parts.GetArrayLength() > 0)
            {
                return parts[0].GetProperty("text").GetString() ?? string.Empty;
            }
        }

        return string.Empty;
    }

    private string CleanupJson(string text)
    {
        text = text.Trim();
        if (text.StartsWith("```json"))
        {
            text = text.Substring(7);
        }
        else if (text.StartsWith("```"))
        {
            text = text.Substring(3);
        }
        
        if (text.EndsWith("```"))
        {
            text = text.Substring(0, text.Length - 3);
        }
        
        return text.Trim();
    }
}
