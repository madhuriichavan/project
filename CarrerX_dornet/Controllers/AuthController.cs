using Azure.Core;
using CareerX_dotnet.ApiRequest;
using CareerX_dotnet.Data;
using CareerX_dotnet.Model;
using CareerX_dotnet.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CareerX_dotnet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly EmailService _emailService;
        
        public AuthController(ApplicationDbContext context, IConfiguration configuration, EmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthRequest request)
        {
            
            var user = await _context.Users
                .SingleOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
                return Unauthorized("Invalid credentials");

            
            var passwordHasher = new PasswordHasher<Users>();

            var result = passwordHasher.VerifyHashedPassword(
                user,
                user.Password,        
                request.Password     
            );

            if (result != PasswordVerificationResult.Success)
                return Unauthorized("Invalid credentials");

           
            var token = GenerateToken(user.UserId, user.Name, user.Role.ToString());

            return Ok(new
            {
                token,
                user = new
                {
                    id = user.UserId,
                    userName = user.Name,
                    email = user.Email,
                    role = user.Role
                }
            });
        }

        private string GenerateToken(int userId, string userName, string role)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Name, userName),
                new Claim(ClaimTypes.Role, role)
            };

            var key = new SymmetricSecurityKey(
                  Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"])
            );

            var creds = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
            {
                // Don't reveal if email exists or not for security
                return Ok(new { message = "If the email exists, an OTP has been sent." });
            }

            // Generate 6-digit OTP
            var random = new Random();
            var otp = random.Next(100000, 999999).ToString();

            // Save OTP to database
            var otpRecord = new OTP
            {
                Email = request.Email,
                OtpCode = otp,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddMinutes(10),
                IsUsed = false
            };

            // Remove old OTPs for this email
            var oldOtps = await _context.OTPs
                .Where(o => o.Email == request.Email && !o.IsUsed)
                .ToListAsync();
            _context.OTPs.RemoveRange(oldOtps);

            _context.OTPs.Add(otpRecord);
            await _context.SaveChangesAsync();

            // Send OTP email
            await _emailService.SendOTPEmailAsync(request.Email, otp);

            return Ok(new { message = "OTP has been sent to your email." });
        }

        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOTP([FromBody] VerifyOTPRequest request)
        {
            var otpRecord = await _context.OTPs
                .Where(o => o.Email == request.Email && 
                           o.OtpCode == request.OtpCode && 
                           !o.IsUsed &&
                           o.ExpiresAt > DateTime.UtcNow)
                .OrderByDescending(o => o.CreatedAt)
                .FirstOrDefaultAsync();

            if (otpRecord == null)
            {
                return BadRequest(new { message = "Invalid or expired OTP." });
            }

            return Ok(new { message = "OTP verified successfully." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            if (request.NewPassword != request.ConfirmPassword)
            {
                return BadRequest(new { message = "Passwords do not match." });
            }

            // Verify OTP
            var otpRecord = await _context.OTPs
                .Where(o => o.Email == request.Email && 
                           o.OtpCode == request.OtpCode && 
                           !o.IsUsed &&
                           o.ExpiresAt > DateTime.UtcNow)
                .OrderByDescending(o => o.CreatedAt)
                .FirstOrDefaultAsync();

            if (otpRecord == null)
            {
                return BadRequest(new { message = "Invalid or expired OTP." });
            }

            // Find user
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            // Update password
            var passwordHasher = new PasswordHasher<Users>();
            user.Password = passwordHasher.HashPassword(user, request.NewPassword);
            
            _context.Users.Update(user);
            
            // Mark OTP as used
            otpRecord.IsUsed = true;
            _context.OTPs.Update(otpRecord);
            
            await _context.SaveChangesAsync();

            return Ok(new { message = "Password reset successfully." });
        }
    }
}
