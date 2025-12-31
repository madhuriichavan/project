using System.ComponentModel.DataAnnotations;

namespace CareerX_dotnet.Model;

public class ExploreCareer
{
    [Key]
    public int CareerId { get; set; }
    
    [Required]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    public string Description { get; set; } = string.Empty;
    
    public string? ImageUrl { get; set; }
    
    public string? RequiredEducation { get; set; }
    
    public string? SkillsRequired { get; set; }
    
    public string? JobSector { get; set; }
    
    public decimal? AverageSalary { get; set; }
    
    public string? CareerPath { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAt { get; set; }
}

