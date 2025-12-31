using CareerX_dotnet.ApiRequest;
using CareerX_dotnet.Data;
using CareerX_dotnet.Model;
using CareerX_dotnet.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CareerX_dotnet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService;

        public UsersController(ApplicationDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Users>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Users>> GetUsers(int id)
        {
            var users = await _context.Users.FindAsync(id);

            if (users == null)
            {
                return NotFound($"User Not Exit with ID "+id);
            }

            return users;
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsers(int id, Users users)
        {
            if (id != users.UserId)
            {
                return NotFound($"User Not Exit with ID " + id); 
            }

            _context.Entry(users).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsersExists(id))
                {
                    return NotFound($"User Not Exit with ID " + id);
                }
                else
                {
                    throw;
                }
            }

            return Ok($"User Update Successfully with Id {id}");
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Users>> PostUsers(UserRequest users)
        {
            // Check if email already exists
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == users.Email);
            
            if (existingUser != null)
            {
                return BadRequest("Email already registered.");
            }

            var passwordHasher = new PasswordHasher<Users>();

            var user = new Users
            {
                Name = users.Name,
                Password = users.Password,
                Email = users.Email,
                Age = users.Age,
                Role = Model.Enums.UserRole.Student, // Default to Student role
                Location = users.Location
            };
            user.Password = passwordHasher.HashPassword(user, users.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Send registration confirmation email
            try
            {
                await _emailService.SendRegistrationEmailAsync(user.Email, user.Name);
            }
            catch (Exception ex)
            {
                // Log error but don't fail registration
                Console.WriteLine($"Failed to send registration email: {ex.Message}");
            }

            return CreatedAtAction("GetUsers", new { id = user.UserId }, new
            {
                userId = user.UserId,
                name = user.Name,
                email = user.Email,
                role = user.Role,
                message = "User registered successfully. Please login to continue."
            });
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsers(int id)
        {
            var users = await _context.Users.FindAsync(id);
            if (users == null)
            {
                return NotFound();
            }

            _context.Users.Remove(users);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UsersExists(int id)
        {
            return _context.Users.Any(e => e.UserId == id);
        }
    }
}
