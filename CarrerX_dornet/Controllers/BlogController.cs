using CareerX_dotnet.Data;
using CareerX_dotnet.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CareerX_dotnet.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BlogController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BlogController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Blog (Public - get all published blogs)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Blog>>> GetBlogs()
    {
        return await _context.Blogs
            .Where(b => b.IsPublished)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();
    }

    // GET: api/Blog/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Blog>> GetBlog(int id)
    {
        var blog = await _context.Blogs.FindAsync(id);

        if (blog == null)
        {
            return NotFound();
        }

        return blog;
    }

    // POST: api/Blog (Admin only)
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Blog>> CreateBlog([FromBody] Blog blog)
    {
        blog.CreatedAt = DateTime.UtcNow;
        _context.Blogs.Add(blog);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBlog), new { id = blog.BlogId }, blog);
    }

    // PUT: api/Blog/5 (Admin only)
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateBlog(int id, [FromBody] Blog blog)
    {
        if (id != blog.BlogId)
        {
            return BadRequest();
        }

        var existingBlog = await _context.Blogs.FindAsync(id);
        if (existingBlog == null)
        {
            return NotFound();
        }

        existingBlog.Title = blog.Title;
        existingBlog.Content = blog.Content;
        existingBlog.ImageUrl = blog.ImageUrl;
        existingBlog.Author = blog.Author;
        existingBlog.IsPublished = blog.IsPublished;
        existingBlog.UpdatedAt = DateTime.UtcNow;

        _context.Entry(existingBlog).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!BlogExists(id))
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

    // DELETE: api/Blog/5 (Admin only)
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteBlog(int id)
    {
        var blog = await _context.Blogs.FindAsync(id);
        if (blog == null)
        {
            return NotFound();
        }

        _context.Blogs.Remove(blog);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool BlogExists(int id)
    {
        return _context.Blogs.Any(e => e.BlogId == id);
    }
}

