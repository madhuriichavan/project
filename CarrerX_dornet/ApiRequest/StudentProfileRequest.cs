using CareerX_dotnet.Model.Enums;
using System.ComponentModel.DataAnnotations;

namespace CareerX_dotnet.ApiRequest;

public class StudentProfileRequest
{
    // General Information
    [Required(ErrorMessage = "General Information is required")]
    public GeneralInformationRequest GeneralInformation { get; set; }

    // Education Details
    [Required(ErrorMessage = "Education Details is required")]
    public EducationDetailsRequest EducationDetails { get; set; }

    // Career Interests
    public CareerInterestsRequest CareerInterests { get; set; }

    // Skills & Strengths
    public SkillsAndStrengthsRequest SkillsAndStrengths { get; set; }

    // Hobbies & Interests
    public HobbiesAndInterestsRequest HobbiesAndInterests { get; set; }

    // Achievements & Certifications
    public AchievementsAndCertificationsRequest AchievementsAndCertifications { get; set; }

    // Entrance Exams
    public EntranceExamsRequest EntranceExams { get; set; }
}

public class GeneralInformationRequest
{
    [Required(ErrorMessage = "Date of Birth is required")]
    public DateTime DateOfBirth { get; set; }

    [Required(ErrorMessage = "Gender is required")]
    public Gender Gender { get; set; }

    [Required(ErrorMessage = "Mobile Number is required")]
    [RegularExpression(@"^[0-9]{10}$", ErrorMessage = "Mobile Number must be 10 digits")]
    public string MobileNumber { get; set; }

    public string PreferredLanguage { get; set; }
}

public class EducationDetailsRequest
{
    [Required(ErrorMessage = "Current Education Level is required")]
    public EducationLevel CurrentEducationLevel { get; set; }

    public string BoardOrUniversity { get; set; }

    public string SchoolOrCollegeName { get; set; }

    public Streams? Streams { get; set; }

    public string CurrentYearOrSemester { get; set; }

    public decimal? OverallPercentageOrCGPA { get; set; }

    // Education Gap Details
    public bool HasTakenGapYear { get; set; }

    public int? NumberOfGapYears { get; set; }

    public GapReason? ReasonForGap { get; set; }
}

public class CareerInterestsRequest
{
    public CareerInterest? AreasOfInterest { get; set; }

    public string? PreferredCareerDomain { get; set; }

    public string DreamJobOrRole { get; set; }
}

public class SkillsAndStrengthsRequest
{
    public TechnicalSkill? TechnicalSkills { get; set; }

    public SoftSkill? SoftSkills { get; set; }

    public SkillLevel? SkillLevel { get; set; }
}

public class HobbiesAndInterestsRequest
{
    public string Hobbies { get; set; }

    public string ExtracurricularActivities { get; set; }
}

public class AchievementsAndCertificationsRequest
{
    public string AcademicAchievements { get; set; }

    public string Scholarships { get; set; }

    public string RankOrMeritCertificates { get; set; }

    public string CompetitionsOrHackathons { get; set; }

    public string SportsOrCulturalAchievements { get; set; }

    public string Certifications { get; set; }

    public string CertificationCourseName { get; set; }

    public string CertificationPlatform { get; set; }

    public int? CertificationYear { get; set; }
}

public class EntranceExamsRequest
{
    public bool AppearedForCompetitiveExams { get; set; }

    public string ExamName { get; set; }

    public string ExamScoreOrRank { get; set; }

    public int? ExamYear { get; set; }
}
