using CareerX_dotnet.Model.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareerX_dotnet.Model;

public class StudentProfile
{
    [Key]
    public int StudentId { get; set; }

    [Required]
    public int UserId { get; set; }

    [ForeignKey("UserId")]
    public Users User { get; set; }

    // Basic Information for Assessment (Mandatory)
    [Required(ErrorMessage = "Date of Birth is required")]
    public DateTime DateOfBirth { get; set; }

    [Required(ErrorMessage = "Gender is required")]
    public Gender Gender { get; set; }

    [Required(ErrorMessage = "Mobile Number is required")]
    [RegularExpression(@"^[0-9]{10}$", ErrorMessage = "Mobile Number must be 10 digits")]
    public string MobileNumber { get; set; }

    public string PreferredLanguage { get; set; }

    // Academic Details
    [Required(ErrorMessage = "Current Education Level is required")]
    public EducationLevel CurrentEducationLevel { get; set; }

    public string BoardOrUniversity { get; set; }

    public string SchoolOrCollegeName { get; set; }

    public Streams? Stream { get; set; }

    public string CurrentYearOrSemester { get; set; }

    public decimal? OverallPercentageOrCGPA { get; set; }

    // Education Gap Details
    public bool HasTakenGapYear { get; set; }

    public int? NumberOfGapYears { get; set; }

    public GapReason? ReasonForGap { get; set; }

    // Career Interests & Preferences
    public CareerInterest? AreasOfInterest { get; set; }

    public string? PreferredCareerDomain { get; set; } // Multiple select stored as comma-separated

    public string DreamJobOrRole { get; set; }

    // Skills & Strengths
    public TechnicalSkill? TechnicalSkills { get; set; }

    public SoftSkill? SoftSkills { get; set; }

    public SkillLevel? SkillLevel { get; set; }

    // Hobbies & Interests
    public string Hobbies { get; set; }

    public string ExtracurricularActivities { get; set; }

    // Achievements & Certifications
    public string AcademicAchievements { get; set; }

    public string Scholarships { get; set; }

    public string RankOrMeritCertificates { get; set; }

    public string CompetitionsOrHackathons { get; set; }

    public string SportsOrCulturalAchievements { get; set; }

    public string Certifications { get; set; }

    public string CertificationCourseName { get; set; }

    public string CertificationPlatform { get; set; }

    public int? CertificationYear { get; set; }

    // Entrance Exams / Tests
    public bool AppearedForCompetitiveExams { get; set; }

    public string ExamName { get; set; }

    public string ExamScoreOrRank { get; set; }

    public int? ExamYear { get; set; }

    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }
}

