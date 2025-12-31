using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CareerX_dotnet.Data;
using System.Text.Json;
using CareerX_dotnet.Model;

namespace CareerX_dotnet.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssessmentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly GeminiAssessmentService _ai;

        public AssessmentController(ApplicationDbContext context, GeminiAssessmentService ai)
        {
            _context = context;
            _ai = ai;
        }

        // 1. Create Assessment (Generate 60 Questions)
        [HttpPost("generate/{userId}")]
        public async Task<IActionResult> StartTest(int userId)
        {
            var profile = await _context.StudentProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile == null) return NotFound("Student profile not found.");

            var profileJson = JsonSerializer.Serialize(profile);
            var questions = await _ai.Generate60QuestionsAsync(profileJson);

            var session = new AssessmentSession
            {
                UserId = userId,
                QuestionsJson = JsonSerializer.Serialize(questions)
            };

            _context.AssessmentSessions.Add(session);
            await _context.SaveChangesAsync();

            return Ok(new { SessionId = session.Id, Questions = questions });
        }

        // 2. Submit Answers and Save to DB
        [HttpPost("submit/{sessionId}")]
        public async Task<IActionResult> SubmitTest(int sessionId, [FromBody] List<int> answers)
        {
            var session = await _context.AssessmentSessions.FindAsync(sessionId);
            if (session == null) return NotFound();

            var profile = await _context.StudentProfiles.FirstOrDefaultAsync(p => p.UserId == session.UserId);
            
            // Call AI to evaluate
            var report = await _ai.EvaluateResultsAsync(session.QuestionsJson, JsonSerializer.Serialize(answers), JsonSerializer.Serialize(profile));

            session.UserAnswersJson = JsonSerializer.Serialize(answers);
            session.CareerReportJson = report;
            session.IsCompleted = true;

            await _context.SaveChangesAsync();

            return Ok(JsonSerializer.Deserialize<object>(report));
        }

        // 3. Get existing report (Swagger GET)
        [HttpGet("report/{sessionId}")]
        public async Task<IActionResult> GetReport(int sessionId)
        {
            var session = await _context.AssessmentSessions.FindAsync(sessionId);
            if (session == null || !session.IsCompleted) return NotFound("Report not ready or session missing.");

            return Ok(JsonSerializer.Deserialize<object>(session.CareerReportJson!));
        }
    }
}