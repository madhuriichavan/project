using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareerX_dotnet.Model;

public class Assessment
{
    [Key]
    public int AssessmentId { get; set; }
    
    [Required]
    public string Title { get; set; } = string.Empty;
    
    public string? Description { get; set; }
    
    [Required]
    public string QuestionsJson { get; set; } = string.Empty;
    
    public int DurationMinutes { get; set; } = 60;
    
    public bool IsActive { get; set; } = true;
    
    public bool WebcamRequired { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAt { get; set; }
    
    public int CreatedBy { get; set; } // Admin UserId
}

public class StudentAssessment
{
    [Key]
    public int StudentAssessmentId { get; set; }
    
    [Required]
    public int StudentId { get; set; }
    
    [ForeignKey("StudentId")]
    public Users Student { get; set; }
    
    [Required]
    public int AssessmentId { get; set; }
    
    [ForeignKey("AssessmentId")]
    public Assessment Assessment { get; set; }
    
    public string? AnswersJson { get; set; }
    
    public string? ResultJson { get; set; }
    
    public decimal? Score { get; set; }
    
    public bool IsCompleted { get; set; } = false;
    
    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? CompletedAt { get; set; }
    
    public string? WebcamRecordingUrl { get; set; }
}

public class McqQuestion
{
    public string QuestionText { get; set; } = string.Empty;
    public List<string> Options { get; set; } = new();
    public int CorrectOptionIndex { get; set; }
    public string Category { get; set; } = string.Empty;
}

