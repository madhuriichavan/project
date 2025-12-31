namespace CareerX_dotnet.Model;

public class AssessmentSession
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string QuestionsJson { get; set; } = string.Empty;
    public string? UserAnswersJson { get; set; } = string.Empty;
    public string? CareerReportJson { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}