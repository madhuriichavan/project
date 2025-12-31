using CareerX_dotnet.Model.Enums;

namespace CareerX_dotnet.ApiResponse;

public class StudentProfileResponse
{
    public int StudentId { get; set; }
    public int UserId { get; set; }

    // General Information
    public GeneralInformation GeneralInformation { get; set; }

    // Education Details
    public EducationDetails EducationDetails { get; set; }

    // Career Interests
    public CareerInterests CareerInterests { get; set; }

    // Skills & Strengths
    public SkillsAndStrengths SkillsAndStrengths { get; set; }

    // Hobbies & Interests
    public HobbiesAndInterests HobbiesAndInterests { get; set; }

    // Achievements & Certifications
    public AchievementsAndCertifications AchievementsAndCertifications { get; set; }

    // Entrance Exams
    public EntranceExams EntranceExams { get; set; }

    // Timestamps
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class GeneralInformation
{
    // User Information (from User table)
    public string Name { get; set; }
    public string Email { get; set; }
    public string Location { get; set; }
    public int Age { get; set; }

    // Student Profile Basic Information
    public DateTime DateOfBirth { get; set; }
    public Gender Gender { get; set; }
    public string MobileNumber { get; set; }
    public string PreferredLanguage { get; set; }
}

public class EducationDetails
{
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
}

public class CareerInterests
{
    public CareerInterest? AreasOfInterest { get; set; }
    public string PreferredCareerDomain { get; set; }
    public string DreamJobOrRole { get; set; }
}

public class SkillsAndStrengths
{
    public TechnicalSkill? TechnicalSkills { get; set; }
    public SoftSkill? SoftSkills { get; set; }
    public SkillLevel? SkillLevel { get; set; }
}

public class HobbiesAndInterests
{
    public string Hobbies { get; set; }
    public string ExtracurricularActivities { get; set; }
}

public class AchievementsAndCertifications
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

public class EntranceExams
{
    public bool AppearedForCompetitiveExams { get; set; }
    public string ExamName { get; set; }
    public string ExamScoreOrRank { get; set; }
    public int? ExamYear { get; set; }
}
