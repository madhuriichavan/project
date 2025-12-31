using CareerX_dotnet.Data;
using CareerX_dotnet.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CareerX_dotnet.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ExploreCareerController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ExploreCareerController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/ExploreCareer (Public)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ExploreCareer>>> GetExploreCareers()
    {
        return await _context.ExploreCareers
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    // GET: api/ExploreCareer/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ExploreCareer>> GetExploreCareer(int id)
    {
        var career = await _context.ExploreCareers.FindAsync(id);

        if (career == null)
        {
            return NotFound();
        }

        return career;
    }

    // POST: api/ExploreCareer (Admin only)
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ExploreCareer>> CreateExploreCareer([FromBody] ExploreCareer career)
    {
        career.CreatedAt = DateTime.UtcNow;
        _context.ExploreCareers.Add(career);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetExploreCareer), new { id = career.CareerId }, career);
    }

    // PUT: api/ExploreCareer/5 (Admin only)
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateExploreCareer(int id, [FromBody] ExploreCareer career)
    {
        if (id != career.CareerId)
        {
            return BadRequest();
        }

        var existingCareer = await _context.ExploreCareers.FindAsync(id);
        if (existingCareer == null)
        {
            return NotFound();
        }

        existingCareer.Title = career.Title;
        existingCareer.Description = career.Description;
        existingCareer.ImageUrl = career.ImageUrl;
        existingCareer.RequiredEducation = career.RequiredEducation;
        existingCareer.SkillsRequired = career.SkillsRequired;
        existingCareer.JobSector = career.JobSector;
        existingCareer.AverageSalary = career.AverageSalary;
        existingCareer.CareerPath = career.CareerPath;
        existingCareer.UpdatedAt = DateTime.UtcNow;

        _context.Entry(existingCareer).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ExploreCareerExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // DELETE: api/ExploreCareer/5 (Admin only)
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteExploreCareer(int id)
    {
        var career = await _context.ExploreCareers.FindAsync(id);
        if (career == null)
        {
            return NotFound();
        }

        _context.ExploreCareers.Remove(career);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ExploreCareerExists(int id)
    {
        return _context.ExploreCareers.Any(e => e.CareerId == id);
    }
}

