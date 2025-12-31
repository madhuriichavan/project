using CareerX_dotnet.Data;
using CareerX_dotnet.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;

namespace CareerX_dotnet.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class AdminAssessmentController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminAssessmentController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/AdminAssessment (Get all assessments - Admin sees all, Students see active only)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Assessment>>> GetAssessments()
    {
        var role = User.FindFirst(ClaimTypes.Role)?.Value;
        
        if (role == "Admin")
        {
            return await _context.Assessments
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }
        else
        {
            return await _context.Assessments
                .Where(a => a.IsActive)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }
    }

    // GET: api/AdminAssessment/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Assessment>> GetAssessment(int id)
    {
        var assessment = await _context.Assessments.FindAsync(id);

        if (assessment == null)
        {
            return NotFound();
        }

        var role = User.FindFirst(ClaimTypes.Role)?.Value;
        if (role != "Admin" && !assessment.IsActive)
        {
            return Forbid();
        }

        return assessment;
    }

    // Assessments are now AI-generated only - Admin cannot create/edit/delete assessments manually

    private bool AssessmentExists(int id)
    {
        return _context.Assessments.Any(e => e.AssessmentId == id);
    }
}

