using CareerX_dotnet.Data;
using CareerX_dotnet.Model;
using CareerX_dotnet.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;

namespace CareerX_dotnet.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class RoadmapController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly EmailService _emailService;
    private readonly HttpClient _httpClient;

    public RoadmapController(ApplicationDbContext context, IConfiguration configuration, EmailService emailService, HttpClient httpClient)
    {
        _context = context;
        _configuration = configuration;
        _emailService = emailService;
        _httpClient = httpClient;
    }

    // POST: api/Roadmap/generate (Generate roadmap after payment)
    [HttpPost("generate")]
    public async Task<IActionResult> GenerateRoadmap([FromBody] GenerateRoadmapRequest request)
    {
        var studentId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        
        // Verify payment
        var payment = await _context.Payments
            .FirstOrDefaultAsync(p => p.PaymentId == request.PaymentId && p.StudentId == studentId && p.PaymentStatus == "Completed");

        if (payment == null)
        {
            return BadRequest("Payment not found or not completed.");
        }

        // Check if roadmap already exists
        var existingRoadmap = await _context.Roadmaps
            .FirstOrDefaultAsync(r => r.PaymentId == request.PaymentId);

        if (existingRoadmap != null)
        {
            return Ok(new
            {
                roadmapId = existingRoadmap.RoadmapId,
                careerOptions = string.IsNullOrEmpty(existingRoadmap.CareerOption) ? null : JsonSerializer.Deserialize<object>(existingRoadmap.CareerOption),
                roadmap = string.IsNullOrEmpty(existingRoadmap.RoadmapJson) ? null : JsonSerializer.Deserialize<object>(existingRoadmap.RoadmapJson)
            });
        }

        // Get student profile and assessment results
        var studentProfile = await _context.StudentProfiles
            .Include(sp => sp.User)
            .FirstOrDefaultAsync(sp => sp.UserId == studentId);

        if (studentProfile == null)
        {
            return BadRequest("Student profile not found.");
        }

        // Get latest assessment results
        var latestAssessment = await _context.StudentAssessments
            .Include(sa => sa.Assessment)
            .Where(sa => sa.StudentId == studentId && sa.IsCompleted)
            .OrderByDescending(sa => sa.CompletedAt)
            .FirstOrDefaultAsync();

        if (latestAssessment == null)
        {
            return BadRequest("No completed assessments found.");
        }

        // Generate roadmap using AI
        var roadmapData = await GenerateRoadmapWithAI(studentProfile, latestAssessment);

        // Save roadmap
        var roadmap = new Roadmap
        {
            StudentId = studentId,
            PaymentId = request.PaymentId,
            CareerOption = JsonSerializer.Serialize(roadmapData.Top3Careers),
            RoadmapJson = JsonSerializer.Serialize(roadmapData.Roadmaps),
            RoadmapHtml = roadmapData.HtmlContent,
            CreatedAt = DateTime.UtcNow
        };

        _context.Roadmaps.Add(roadmap);
        await _context.SaveChangesAsync();

        // Send email with roadmap
        if (studentProfile.User != null)
        {
            await _emailService.SendRoadmapEmailAsync(
                studentProfile.User.Email,
                studentProfile.User.Name,
                roadmapData.HtmlContent
            );
            roadmap.IsEmailSent = true;
            await _context.SaveChangesAsync();
        }

        return Ok(new
        {
            roadmapId = roadmap.RoadmapId,
            careerOptions = roadmapData.Top3Careers,
            roadmap = roadmapData.Roadmaps,
            htmlContent = roadmapData.HtmlContent
        });
    }

    // GET: api/Roadmap/my-roadmaps
    [HttpGet("my-roadmaps")]
    public async Task<IActionResult> GetMyRoadmaps()
    {
        var studentId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        
        var roadmapEntities = await _context.Roadmaps
            .Include(r => r.Payment)
            .Where(r => r.StudentId == studentId)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new
            {
                r.RoadmapId,
                r.CareerOption,
                r.RoadmapJson,
                r.RoadmapHtml,
                r.CreatedAt,
                r.PaymentId
            })
            .ToListAsync();

        var roadmaps = roadmapEntities.Select(r => new
        {
            roadmapId = r.RoadmapId,
            careerOptions = string.IsNullOrEmpty(r.CareerOption) ? null : JsonSerializer.Deserialize<object>(r.CareerOption),
            roadmap = string.IsNullOrEmpty(r.RoadmapJson) ? null : JsonSerializer.Deserialize<object>(r.RoadmapJson),
            htmlContent = r.RoadmapHtml,
            createdAt = r.CreatedAt,
            paymentId = r.PaymentId
        });

        return Ok(roadmaps);
    }

    // GET: api/Roadmap/{roadmapId}
    [HttpGet("{roadmapId}")]
    public async Task<IActionResult> GetRoadmap(int roadmapId)
    {
        var studentId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        
        var roadmap = await _context.Roadmaps
            .FirstOrDefaultAsync(r => r.RoadmapId == roadmapId && r.StudentId == studentId);

        if (roadmap == null)
        {
            return NotFound();
        }

        return Ok(new
        {
            roadmapId = roadmap.RoadmapId,
            careerOptions = string.IsNullOrEmpty(roadmap.CareerOption) ? null : JsonSerializer.Deserialize<object>(roadmap.CareerOption),
            roadmap = string.IsNullOrEmpty(roadmap.RoadmapJson) ? null : JsonSerializer.Deserialize<object>(roadmap.RoadmapJson),
            htmlContent = roadmap.RoadmapHtml,
            createdAt = roadmap.CreatedAt
        });
    }

    private async Task<RoadmapData> GenerateRoadmapWithAI(StudentProfile profile, StudentAssessment assessment)
    {
        var apiKey = _configuration["Gemini:ApiKey"] ?? throw new Exception("API Key Missing");
        var model = "gemini-2.5-flash";
        var url = $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}";

        var profileJson = JsonSerializer.Serialize(profile);
        var assessmentResult = assessment.ResultJson ?? "{}";

        var prompt = $@"
You are an expert Career Counselor. Based on the following student profile and assessment results, generate a comprehensive career roadmap.

Student Profile: {profileJson}
Assessment Results: {assessmentResult}

Generate a detailed roadmap for the TOP 3 BEST career options based on the assessment.

For each career option, provide:
1. Career Name
2. Why this career fits the student
3. Step-by-step roadmap (from basic to advanced):
   - Foundation Phase (Months 1-6)
   - Intermediate Phase (Months 7-12)
   - Advanced Phase (Months 13-18)
   - Professional Phase (Months 19-24)
4. Required skills and certifications
5. Recommended courses/resources
6. Job market outlook
7. Expected salary range
8. Timeline and milestones

Return a JSON object with this structure:
{{
  ""top3Careers"": [
    {{
      ""careerName"": ""Career Name"",
      ""fitScore"": 95,
      ""whyFit"": ""Explanation""
    }}
  ],
  ""roadmaps"": [
    {{
      ""careerName"": ""Career Name"",
      ""phases"": [
        {{
          ""phaseName"": ""Foundation Phase"",
          ""duration"": ""Months 1-6"",
          ""steps"": [""Step 1"", ""Step 2""],
          ""skills"": [""Skill 1"", ""Skill 2""],
          ""certifications"": [""Cert 1""],
          ""resources"": [""Resource 1""]
        }}
      ],
      ""jobMarketOutlook"": ""Description"",
      ""salaryRange"": ""Range"",
      ""timeline"": ""24 months""
    }}
  ],
  ""htmlContent"": ""Formatted HTML version of the roadmap""
}}

Return ONLY valid JSON.";

        var payload = new
        {
            contents = new[] { new { parts = new[] { new { text = prompt } } } },
            generationConfig = new { response_mime_type = "application/json", max_output_tokens = 16384 }
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

        // Clean markdown if present
        rawJson = CleanJson(rawJson!);

        var roadmapData = JsonSerializer.Deserialize<RoadmapData>(rawJson, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        // Generate HTML content if not provided
        if (string.IsNullOrEmpty(roadmapData?.HtmlContent))
        {
            roadmapData!.HtmlContent = GenerateHtmlFromRoadmap(roadmapData);
        }

        return roadmapData!;
    }

    private string GenerateHtmlFromRoadmap(RoadmapData data)
    {
        var html = "<div style='font-family: Arial, sans-serif;'>";
        html += "<h1 style='color: #2F4156;'>Your Personalized Career Roadmap</h1>";

        foreach (var roadmap in data.Roadmaps)
        {
            html += $"<div style='margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 5px;'>";
            html += $"<h2 style='color: #567C8D;'>{roadmap.CareerName}</h2>";

            foreach (var phase in roadmap.Phases)
            {
                html += $"<h3>{phase.PhaseName} - {phase.Duration}</h3>";
                html += "<ul>";
                foreach (var step in phase.Steps)
                {
                    html += $"<li>{step}</li>";
                }
                html += "</ul>";
            }

            html += $"<p><strong>Job Market Outlook:</strong> {roadmap.JobMarketOutlook}</p>";
            html += $"<p><strong>Salary Range:</strong> {roadmap.SalaryRange}</p>";
            html += $"<p><strong>Timeline:</strong> {roadmap.Timeline}</p>";
            html += "</div>";
        }

        html += "</div>";
        return html;
    }

    private string CleanJson(string text)
    {
        if (string.IsNullOrEmpty(text)) return string.Empty;
        
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

public class GenerateRoadmapRequest
{
    public int PaymentId { get; set; }
}

public class RoadmapData
{
    public List<CareerOption> Top3Careers { get; set; } = new();
    public List<CareerRoadmap> Roadmaps { get; set; } = new();
    public string HtmlContent { get; set; } = string.Empty;
}

public class CareerOption
{
    public string CareerName { get; set; } = string.Empty;
    public int FitScore { get; set; }
    public string WhyFit { get; set; } = string.Empty;
}

public class CareerRoadmap
{
    public string CareerName { get; set; } = string.Empty;
    public List<Phase> Phases { get; set; } = new();
    public string JobMarketOutlook { get; set; } = string.Empty;
    public string SalaryRange { get; set; } = string.Empty;
    public string Timeline { get; set; } = string.Empty;
}

public class Phase
{
    public string PhaseName { get; set; } = string.Empty;
    public string Duration { get; set; } = string.Empty;
    public List<string> Steps { get; set; } = new();
    public List<string> Skills { get; set; } = new();
    public List<string> Certifications { get; set; } = new();
    public List<string> Resources { get; set; } = new();
}

