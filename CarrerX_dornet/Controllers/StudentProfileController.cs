using CareerX_dotnet.ApiRequest;
using CareerX_dotnet.Data;
using CareerX_dotnet.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CareerX_dotnet.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class StudentProfileController : ControllerBase
{
    private readonly StudentProfileService _studentProfileService;
    private readonly ApplicationDbContext _context;

    public StudentProfileController(StudentProfileService studentProfileService, ApplicationDbContext context)
    {
        _studentProfileService = studentProfileService;
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> CreateStudentProfile([FromBody] StudentProfileRequest request)
    {
        try
        {
            var userId = GetUserIdFromToken();
            var response = await _studentProfileService.CreateStudentProfileAsync(userId, request);
            return CreatedAtAction(nameof(GetStudentProfile), new { userId = userId }, response);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetStudentProfile()
    {
        try
        {
            var userId = GetUserIdFromToken();
            var response = await _studentProfileService.GetStudentProfileAsync(userId);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("{studentId:int}")]
    public async Task<IActionResult> GetStudentProfileById(int studentId)
    {
        try
        {
            var response = await _studentProfileService.GetStudentProfileByIdAsync(studentId);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPut]
    public async Task<IActionResult> UpdateStudentProfile([FromBody] StudentProfileRequest request)
    {
        try
        {
            var userId = GetUserIdFromToken();
            var response = await _studentProfileService.UpdateStudentProfileAsync(userId, request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteStudentProfile()
    {
        try
        {
            var userId = GetUserIdFromToken();
            var result = await _studentProfileService.DeleteStudentProfileAsync(userId);
            
            if (result)
            {
                return Ok(new { message = "Student profile deleted successfully" });
            }
            
            return NotFound(new { message = "Student profile not found" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // POST: api/StudentProfile/picture (Upload profile picture)
    [HttpPost("picture")]
    public async Task<IActionResult> UploadProfilePicture(IFormFile file)
    {
        try
        {
            var userId = GetUserIdFromToken();
            
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            // Validate file type
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(fileExtension))
            {
                return BadRequest("Invalid file type. Only images are allowed.");
            }

            // Validate file size (max 5MB)
            if (file.Length > 5 * 1024 * 1024)
            {
                return BadRequest("File size exceeds 5MB limit.");
            }

            // Save file locally (in production, use S3 or cloud storage)
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "profiles");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var fileName = $"{userId}_{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var fileUrl = $"/uploads/profiles/{fileName}";

            // Update user profile picture
            var user = await _context.Users.FindAsync(userId);
            if (user != null)
            {
                // Delete old profile picture if exists
                if (!string.IsNullOrEmpty(user.ProfilePictureUrl))
                {
                    var oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", user.ProfilePictureUrl.TrimStart('/'));
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath);
                    }
                }

                user.ProfilePictureUrl = fileUrl;
                await _context.SaveChangesAsync();
            }

            return Ok(new { profilePictureUrl = fileUrl });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    private int GetUserIdFromToken()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            throw new UnauthorizedAccessException("User ID not found in token");
        }

        return userId;
    }
}

