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
public class StudentAssessmentController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly GeminiAssessmentService _geminiService;
    private readonly EmailService _emailService;
    private readonly PdfService _pdfService;

    public StudentAssessmentController(ApplicationDbContext context, GeminiAssessmentService geminiService, EmailService emailService, PdfService pdfService)
    {
        _context = context;
        _geminiService = geminiService;
        _emailService = emailService;
        _pdfService = pdfService;
    }

    // GET: api/StudentAssessment/available (Check if student can take assessment)
    [HttpGet("available")]
    public async Task<ActionResult<object>> GetAvailableAssessments()
    {
        var studentId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        
        // Check if student has completed profile
        var profile = await _context.StudentProfiles
            .FirstOrDefaultAsync(sp => sp.UserId == studentId);

        if (profile == null)
        {
            return Ok(new { canTakeAssessment = false, message = "Please complete your profile first." });
        }

        // Check if student has already completed an assessment
        var completedAssessment = await _context.StudentAssessments
            .FirstOrDefaultAsync(sa => sa.StudentId == studentId && sa.IsCompleted);

        if (completedAssessment != null)
        {
            return Ok(new { canTakeAssessment = false, message = "You have already completed the assessment.", hasCompleted = true });
        }

        // Check if there's an in-progress assessment
        var inProgressAssessment = await _context.StudentAssessments
            .Include(sa => sa.Assessment)
            .FirstOrDefaultAsync(sa => sa.StudentId == studentId && !sa.IsCompleted);

        if (inProgressAssessment != null)
        {
            return Ok(new 
            { 
                canTakeAssessment = true, 
                hasInProgress = true,
                studentAssessmentId = inProgressAssessment.StudentAssessmentId,
                assessmentId = inProgressAssessment.AssessmentId
            });
        }

        return Ok(new { canTakeAssessment = true, hasInProgress = false });
    }

    // POST: api/StudentAssessment/start (Start an AI-generated assessment)
    [HttpPost("start")]
    public async Task<IActionResult> StartAssessment()
    {
        var studentId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        
        // Check if student has completed profile
        var profile = await _context.StudentProfiles
            .FirstOrDefaultAsync(sp => sp.UserId == studentId);

        if (profile == null)
        {
            return BadRequest("Please complete your profile first before taking the assessment.");
        }

        // Check if already completed
        var completed = await _context.StudentAssessments
            .FirstOrDefaultAsync(sa => sa.StudentId == studentId && sa.IsCompleted);

        if (completed != null)
        {
            return BadRequest("You have already completed the assessment.");
        }

        // Check if already started
        var existing = await _context.StudentAssessments
            .Include(sa => sa.Assessment)
            .FirstOrDefaultAsync(sa => sa.StudentId == studentId && !sa.IsCompleted);

        if (existing != null)
        {
            // Return existing session
            var existingJsonOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var existingQuestions = JsonSerializer.Deserialize<List<McqQuestion>>(existing.Assessment.QuestionsJson, existingJsonOptions);
            
            if (existingQuestions == null)
            {
                // If deserialization fails, delete the corrupted assessment and create a new one
                _context.StudentAssessments.Remove(existing);
                await _context.SaveChangesAsync();
            }
            else
            {
                return Ok(new
                {
                    studentAssessmentId = existing.StudentAssessmentId,
                    questions = existingQuestions,
                    durationMinutes = existing.Assessment.DurationMinutes,
                    webcamRequired = existing.Assessment.WebcamRequired
                });
            }
        }

        // Generate 60 questions using Gemini AI based on student profile
        var jsonOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var profileJson = JsonSerializer.Serialize(profile, jsonOptions);
        List<McqQuestion> questions;
        
        try
        {
            questions = await _geminiService.Generate60QuestionsAsync(profileJson);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Failed to generate assessment: {ex.Message}");
        }

        // Create a new Assessment record to store the generated questions
        var assessment = new Assessment
        {
            Title = "AI-Generated Career Assessment",
            Description = "Personalized assessment based on your profile",
            QuestionsJson = JsonSerializer.Serialize(questions, jsonOptions),
            DurationMinutes = 60,
            IsActive = true,
            WebcamRequired = true,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = studentId // Student's own assessment
        };

        _context.Assessments.Add(assessment);
        await _context.SaveChangesAsync();

        // Create new student assessment
        var studentAssessment = new StudentAssessment
        {
            StudentId = studentId,
            AssessmentId = assessment.AssessmentId,
            StartedAt = DateTime.UtcNow,
            IsCompleted = false
        };

        _context.StudentAssessments.Add(studentAssessment);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            studentAssessmentId = studentAssessment.StudentAssessmentId,
            questions = questions,
            durationMinutes = assessment.DurationMinutes,
            webcamRequired = assessment.WebcamRequired
        });
    }

    // POST: api/StudentAssessment/submit/{studentAssessmentId} (Submit assessment)
    [HttpPost("submit/{studentAssessmentId}")]
    public async Task<IActionResult> SubmitAssessment(int studentAssessmentId, [FromBody] SubmitAssessmentRequest request)
    {
        var studentId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        
        var studentAssessment = await _context.StudentAssessments
            .Include(sa => sa.Assessment)
            .Include(sa => sa.Student)
            .FirstOrDefaultAsync(sa => sa.StudentAssessmentId == studentAssessmentId && sa.StudentId == studentId);

        if (studentAssessment == null)
        {
            return NotFound();
        }

        if (studentAssessment.IsCompleted)
        {
            return BadRequest("Assessment already submitted.");
        }

        var jsonOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        studentAssessment.AnswersJson = JsonSerializer.Serialize(request.Answers, jsonOptions);
        studentAssessment.WebcamRecordingUrl = request.WebcamRecordingUrl;
        studentAssessment.CompletedAt = DateTime.UtcNow;
        studentAssessment.IsCompleted = true;

        // Calculate score
        var questions = JsonSerializer.Deserialize<List<McqQuestion>>(studentAssessment.Assessment.QuestionsJson, jsonOptions);
        var answers = request.Answers;
        int correctAnswers = 0;
        
        if (questions != null && answers != null)
        {
            for (int i = 0; i < Math.Min(questions.Count, answers.Count); i++)
            {
                if (questions[i].CorrectOptionIndex == answers[i])
                {
                    correctAnswers++;
                }
            }
            studentAssessment.Score = (decimal)(correctAnswers * 100.0 / questions.Count);
        }

        // Get student profile for AI recommendation
        var profile = await _context.StudentProfiles
            .FirstOrDefaultAsync(sp => sp.UserId == studentId);

        // Generate recommendations using Gemini AI
        string recommendationJson = string.Empty;
        if (profile != null)
        {
            try
            {
                var jsonOptions2 = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var profileJson = JsonSerializer.Serialize(profile, jsonOptions2);
                var questionsJson = studentAssessment.Assessment.QuestionsJson;
                var answersJson = JsonSerializer.Serialize(request.Answers, jsonOptions2);
                
                recommendationJson = await _geminiService.EvaluateResultsAsync(questionsJson, answersJson, profileJson);
                studentAssessment.ResultJson = recommendationJson;
            }
            catch (Exception ex)
            {
                // Log error but don't fail the submission
                Console.WriteLine($"Failed to generate recommendations: {ex.Message}");
            }
        }

        await _context.SaveChangesAsync();

        // Generate PDF and send email (done in background to not delay response)
        // Generate PDF and send email 
        try
        {
            var pdfBytes = await _pdfService.GenerateAssessmentReportPdf(studentAssessment, questions, request.Answers, recommendationJson);
            
            // Send email with PDF attachment
            if (studentAssessment.Student != null)
            {
                await _emailService.SendAssessmentReportEmailAsync(
                    studentAssessment.Student.Email,
                    studentAssessment.Student.Name,
                    pdfBytes,
                    studentAssessment.Score ?? 0
                );
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to generate PDF or send email: {ex.Message}");
            // We do not fail the request if email fails, but we log it. 
            // In a real app we might want to queue this or alert the user.
        }

        var jsonOptions3 = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var recommendation = string.IsNullOrEmpty(recommendationJson) 
            ? null 
            : JsonSerializer.Deserialize<object>(recommendationJson, jsonOptions3);

        return Ok(new
        {
            studentAssessmentId = studentAssessment.StudentAssessmentId,
            score = studentAssessment.Score,
            recommendation = recommendation,
            message = "Assessment submitted successfully. Report has been sent to your email."
        });
    }

    // GET: api/StudentAssessment/my-assessments (Get student's assessment history)
    [HttpGet("my-assessments")]
    public async Task<ActionResult<IEnumerable<object>>> GetMyAssessments()
    {
        var studentId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        
        var assessmentsData = await _context.StudentAssessments
            .Include(sa => sa.Assessment)
            .Where(sa => sa.StudentId == studentId)
            .OrderByDescending(sa => sa.StartedAt)
            .ToListAsync();

        var assessments = assessmentsData.Select(sa => new
        {
            studentAssessmentId = sa.StudentAssessmentId,
            assessmentId = sa.AssessmentId,
            title = sa.Assessment.Title,
            score = sa.Score,
            isCompleted = sa.IsCompleted,
            startedAt = sa.StartedAt,
            completedAt = sa.CompletedAt,
            recommendation = string.IsNullOrEmpty(sa.ResultJson) ? null : JsonSerializer.Deserialize<object>(sa.ResultJson, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
        }).ToList();

        return Ok(assessments);
    }

    // GET: api/StudentAssessment/report/{studentAssessmentId} (Get assessment report)
    [HttpGet("report/{studentAssessmentId}")]
    public async Task<ActionResult<object>> GetAssessmentReport(int studentAssessmentId)
    {
        var studentId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        
        var studentAssessment = await _context.StudentAssessments
            .Include(sa => sa.Assessment)
            .FirstOrDefaultAsync(sa => sa.StudentAssessmentId == studentAssessmentId && sa.StudentId == studentId && sa.IsCompleted);

        if (studentAssessment == null)
        {
            return NotFound();
        }

        var jsonOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var questions = JsonSerializer.Deserialize<List<McqQuestion>>(studentAssessment.Assessment.QuestionsJson, jsonOptions);
        var answers = string.IsNullOrEmpty(studentAssessment.AnswersJson) 
            ? new List<int>() 
            : JsonSerializer.Deserialize<List<int>>(studentAssessment.AnswersJson, jsonOptions);
        var recommendation = string.IsNullOrEmpty(studentAssessment.ResultJson) 
            ? null 
            : JsonSerializer.Deserialize<object>(studentAssessment.ResultJson, jsonOptions);

        return Ok(new
        {
            studentAssessmentId = studentAssessment.StudentAssessmentId,
            score = studentAssessment.Score,
            questions = questions,
            answers = answers,
            recommendation = recommendation,
            completedAt = studentAssessment.CompletedAt
        });
    }
}

public class SubmitAssessmentRequest
{
    public List<int> Answers { get; set; } = new();
    public string? WebcamRecordingUrl { get; set; }
}

