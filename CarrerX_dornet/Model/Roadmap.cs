using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareerX_dotnet.Model;

public class Roadmap
{
    [Key]
    public int RoadmapId { get; set; }
    
    [Required]
    public int StudentId { get; set; }
    
    [ForeignKey("StudentId")]
    public Users Student { get; set; }
    
    [Required]
    public int PaymentId { get; set; }
    
    [ForeignKey("PaymentId")]
    public Payment Payment { get; set; }
    
    [Required]
    public string CareerOption { get; set; } = string.Empty; // Top 3 career options
    
    [Required]
    public string RoadmapJson { get; set; } = string.Empty; // Full roadmap details
    
    public string? RoadmapHtml { get; set; } // Formatted roadmap
    
    public bool IsEmailSent { get; set; } = false;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

