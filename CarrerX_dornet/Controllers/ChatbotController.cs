using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.Json;

namespace CareerX_dotnet.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ChatbotController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly HttpClient _httpClient;

    public ChatbotController(IConfiguration configuration)
    {
        _configuration = configuration;
        _httpClient = new HttpClient();
    }

    // POST: api/Chatbot/chat
    [HttpPost("chat")]
    public async Task<IActionResult> Chat([FromBody] ChatRequest request)
    {
        var studentId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        
        var apiKey = _configuration["Gemini:ApiKey"] ?? throw new Exception("API Key Missing");
        var model = "gemini-2.5-flash";
        var url = $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}";

        var prompt = $@"
You are a helpful AI career guidance assistant for CareerX platform. 
You help students with career-related questions, provide guidance on assessments, roadmaps, and career planning.

User Question: {request.Message}

Provide a helpful, concise, and professional response. If the question is not career-related, politely redirect to career topics.

Return a JSON object with this structure:
{{
  ""response"": ""Your response text"",
  ""suggestions"": [""Suggestion 1"", ""Suggestion 2""]
}}";

        var payload = new
        {
            contents = new[] { new { parts = new[] { new { text = prompt } } } },
            generationConfig = new { response_mime_type = "application/json", max_output_tokens = 2048 }
        };

        try
        {
            var response = await _httpClient.PostAsJsonAsync(url, payload);
            
            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return BadRequest(new { message = "AI service error", error });
            }

            var result = await response.Content.ReadFromJsonAsync<JsonElement>();
            var rawJson = result.GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            var chatResponse = JsonSerializer.Deserialize<ChatResponse>(rawJson!, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            return Ok(chatResponse);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error processing chat request", error = ex.Message });
        }
    }
}

public class ChatRequest
{
    public string Message { get; set; } = string.Empty;
}

public class ChatResponse
{
    public string Response { get; set; } = string.Empty;
    public List<string> Suggestions { get; set; } = new();
}

