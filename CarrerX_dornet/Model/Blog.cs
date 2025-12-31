using System.ComponentModel.DataAnnotations;

namespace CareerX_dotnet.Model;

public class Blog
{
    [Key]
    public int BlogId { get; set; }
    
    [Required]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    public string Content { get; set; } = string.Empty;
    
    public string? ImageUrl { get; set; }
    
    public string? Author { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAt { get; set; }
    
    public bool IsPublished { get; set; } = true;
}

