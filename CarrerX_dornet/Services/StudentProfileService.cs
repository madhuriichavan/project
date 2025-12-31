using CareerX_dotnet.ApiRequest;
using CareerX_dotnet.ApiResponse;
using CareerX_dotnet.Data;
using CareerX_dotnet.Model;
using Microsoft.EntityFrameworkCore;

namespace CareerX_dotnet.Services;

public class StudentProfileService
{
    private readonly ApplicationDbContext _context;

    public StudentProfileService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<StudentProfileResponse> CreateStudentProfileAsync(int userId, StudentProfileRequest request)
    {
        // Check if user exists
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            throw new Exception($"User with ID {userId} not found");
        }

        // Check if profile already exists
        var existingProfile = await _context.StudentProfiles
            .FirstOrDefaultAsync(sp => sp.UserId == userId);
        
        if (existingProfile != null)
        {
            throw new Exception($"Student profile already exists for user ID {userId}");
        }

        var studentProfile = new StudentProfile
        {
            UserId = userId,
            // General Information
            DateOfBirth = request.GeneralInformation.DateOfBirth,
            Gender = request.GeneralInformation.Gender,
            MobileNumber = request.GeneralInformation.MobileNumber,
            PreferredLanguage = request.GeneralInformation.PreferredLanguage,
            // Education Details
            CurrentEducationLevel = request.EducationDetails.CurrentEducationLevel,
            BoardOrUniversity = request.EducationDetails.BoardOrUniversity,
            SchoolOrCollegeName = request.EducationDetails.SchoolOrCollegeName,
            Stream = request.EducationDetails.Streams,
            CurrentYearOrSemester = request.EducationDetails.CurrentYearOrSemester,
            OverallPercentageOrCGPA = request.EducationDetails.OverallPercentageOrCGPA,
            HasTakenGapYear = request.EducationDetails.HasTakenGapYear,
            NumberOfGapYears = request.EducationDetails.NumberOfGapYears,
            ReasonForGap = request.EducationDetails.ReasonForGap,
            // Career Interests
            AreasOfInterest = request.CareerInterests?.AreasOfInterest,
            PreferredCareerDomain = request.CareerInterests?.PreferredCareerDomain,
            DreamJobOrRole = request.CareerInterests?.DreamJobOrRole,
            // Skills & Strengths
            TechnicalSkills = request.SkillsAndStrengths?.TechnicalSkills,
            SoftSkills = request.SkillsAndStrengths?.SoftSkills,
            SkillLevel = request.SkillsAndStrengths?.SkillLevel,
            // Hobbies & Interests
            Hobbies = request.HobbiesAndInterests?.Hobbies,
            ExtracurricularActivities = request.HobbiesAndInterests?.ExtracurricularActivities,
            // Achievements & Certifications
            AcademicAchievements = request.AchievementsAndCertifications?.AcademicAchievements,
            Scholarships = request.AchievementsAndCertifications?.Scholarships,
            RankOrMeritCertificates = request.AchievementsAndCertifications?.RankOrMeritCertificates,
            CompetitionsOrHackathons = request.AchievementsAndCertifications?.CompetitionsOrHackathons,
            SportsOrCulturalAchievements = request.AchievementsAndCertifications?.SportsOrCulturalAchievements,
            Certifications = request.AchievementsAndCertifications?.Certifications,
            CertificationCourseName = request.AchievementsAndCertifications?.CertificationCourseName,
            CertificationPlatform = request.AchievementsAndCertifications?.CertificationPlatform,
            CertificationYear = request.AchievementsAndCertifications?.CertificationYear,
            // Entrance Exams
            AppearedForCompetitiveExams = request.EntranceExams?.AppearedForCompetitiveExams ?? false,
            ExamName = request.EntranceExams?.ExamName,
            ExamScoreOrRank = request.EntranceExams?.ExamScoreOrRank,
            ExamYear = request.EntranceExams?.ExamYear,
            CreatedAt = DateTime.UtcNow
        };

        _context.StudentProfiles.Add(studentProfile);
        await _context.SaveChangesAsync();

        return MapToResponse(studentProfile);
    }

    public async Task<StudentProfileResponse> GetStudentProfileAsync(int userId)
    {
        var studentProfile = await _context.StudentProfiles
            .Include(sp => sp.User)
            .FirstOrDefaultAsync(sp => sp.UserId == userId);

        if (studentProfile == null)
        {
            throw new Exception($"Student profile not found for user ID {userId}");
        }

        return MapToResponse(studentProfile);
    }

    public async Task<StudentProfileResponse> GetStudentProfileByIdAsync(int studentId)
    {
        var studentProfile = await _context.StudentProfiles
            .Include(sp => sp.User)
            .FirstOrDefaultAsync(sp => sp.StudentId == studentId);

        if (studentProfile == null)
        {
            throw new Exception($"Student profile not found for student ID {studentId}");
        }

        return MapToResponse(studentProfile);
    }

    public async Task<StudentProfileResponse> UpdateStudentProfileAsync(int userId, StudentProfileRequest request)
    {
        var studentProfile = await _context.StudentProfiles
            .Include(sp => sp.User)
            .FirstOrDefaultAsync(sp => sp.UserId == userId);

        if (studentProfile == null)
        {
            throw new Exception($"Student profile not found for user ID {userId}");
        }

        // Update all fields from nested request structure
        // General Information
        studentProfile.DateOfBirth = request.GeneralInformation.DateOfBirth;
        studentProfile.Gender = request.GeneralInformation.Gender;
        studentProfile.MobileNumber = request.GeneralInformation.MobileNumber;
        studentProfile.PreferredLanguage = request.GeneralInformation.PreferredLanguage;
        // Education Details
        studentProfile.CurrentEducationLevel = request.EducationDetails.CurrentEducationLevel;
        studentProfile.BoardOrUniversity = request.EducationDetails.BoardOrUniversity;
        studentProfile.SchoolOrCollegeName = request.EducationDetails.SchoolOrCollegeName;
        studentProfile.Stream = request.EducationDetails.Streams;
        studentProfile.CurrentYearOrSemester = request.EducationDetails.CurrentYearOrSemester;
        studentProfile.OverallPercentageOrCGPA = request.EducationDetails.OverallPercentageOrCGPA;
        studentProfile.HasTakenGapYear = request.EducationDetails.HasTakenGapYear;
        studentProfile.NumberOfGapYears = request.EducationDetails.NumberOfGapYears;
        studentProfile.ReasonForGap = request.EducationDetails.ReasonForGap;
        // Career Interests
        if (request.CareerInterests != null)
        {
            studentProfile.AreasOfInterest = request.CareerInterests.AreasOfInterest;
            studentProfile.PreferredCareerDomain = request.CareerInterests.PreferredCareerDomain;
            studentProfile.DreamJobOrRole = request.CareerInterests.DreamJobOrRole;
        }
        // Skills & Strengths
        if (request.SkillsAndStrengths != null)
        {
            studentProfile.TechnicalSkills = request.SkillsAndStrengths.TechnicalSkills;
            studentProfile.SoftSkills = request.SkillsAndStrengths.SoftSkills;
            studentProfile.SkillLevel = request.SkillsAndStrengths.SkillLevel;
        }
        // Hobbies & Interests
        if (request.HobbiesAndInterests != null)
        {
            studentProfile.Hobbies = request.HobbiesAndInterests.Hobbies;
            studentProfile.ExtracurricularActivities = request.HobbiesAndInterests.ExtracurricularActivities;
        }
        // Achievements & Certifications
        if (request.AchievementsAndCertifications != null)
        {
            studentProfile.AcademicAchievements = request.AchievementsAndCertifications.AcademicAchievements;
            studentProfile.Scholarships = request.AchievementsAndCertifications.Scholarships;
            studentProfile.RankOrMeritCertificates = request.AchievementsAndCertifications.RankOrMeritCertificates;
            studentProfile.CompetitionsOrHackathons = request.AchievementsAndCertifications.CompetitionsOrHackathons;
            studentProfile.SportsOrCulturalAchievements = request.AchievementsAndCertifications.SportsOrCulturalAchievements;
            studentProfile.Certifications = request.AchievementsAndCertifications.Certifications;
            studentProfile.CertificationCourseName = request.AchievementsAndCertifications.CertificationCourseName;
            studentProfile.CertificationPlatform = request.AchievementsAndCertifications.CertificationPlatform;
            studentProfile.CertificationYear = request.AchievementsAndCertifications.CertificationYear;
        }
        // Entrance Exams
        if (request.EntranceExams != null)
        {
            studentProfile.AppearedForCompetitiveExams = request.EntranceExams.AppearedForCompetitiveExams;
            studentProfile.ExamName = request.EntranceExams.ExamName;
            studentProfile.ExamScoreOrRank = request.EntranceExams.ExamScoreOrRank;
            studentProfile.ExamYear = request.EntranceExams.ExamYear;
        }
        studentProfile.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToResponse(studentProfile);
    }

    public async Task<bool> DeleteStudentProfileAsync(int userId)
    {
        var studentProfile = await _context.StudentProfiles
            .FirstOrDefaultAsync(sp => sp.UserId == userId);

        if (studentProfile == null)
        {
            return false;
        }

        _context.StudentProfiles.Remove(studentProfile);
        await _context.SaveChangesAsync();

        return true;
    }

    private StudentProfileResponse MapToResponse(StudentProfile profile)
    {
        return new StudentProfileResponse
        {
            StudentId = profile.StudentId,
            UserId = profile.UserId,
            GeneralInformation = new GeneralInformation
            {
                Name = profile.User?.Name ?? string.Empty,
                Email = profile.User?.Email ?? string.Empty,
                Location = profile.User?.Location ?? string.Empty,
                Age = profile.User?.Age ?? 0,
                DateOfBirth = profile.DateOfBirth,
                Gender = profile.Gender,
                MobileNumber = profile.MobileNumber,
                PreferredLanguage = profile.PreferredLanguage
            },
            EducationDetails = new EducationDetails
            {
                CurrentEducationLevel = profile.CurrentEducationLevel,
                BoardOrUniversity = profile.BoardOrUniversity,
                SchoolOrCollegeName = profile.SchoolOrCollegeName,
                Stream = profile.Stream,
                CurrentYearOrSemester = profile.CurrentYearOrSemester,
                OverallPercentageOrCGPA = profile.OverallPercentageOrCGPA,
                HasTakenGapYear = profile.HasTakenGapYear,
                NumberOfGapYears = profile.NumberOfGapYears,
                ReasonForGap = profile.ReasonForGap
            },
            CareerInterests = new CareerInterests
            {
                AreasOfInterest = profile.AreasOfInterest,
                PreferredCareerDomain = profile.PreferredCareerDomain,
                DreamJobOrRole = profile.DreamJobOrRole
            },
            SkillsAndStrengths = new SkillsAndStrengths
            {
                TechnicalSkills = profile.TechnicalSkills,
                SoftSkills = profile.SoftSkills,
                SkillLevel = profile.SkillLevel
            },
            HobbiesAndInterests = new HobbiesAndInterests
            {
                Hobbies = profile.Hobbies,
                ExtracurricularActivities = profile.ExtracurricularActivities
            },
            AchievementsAndCertifications = new AchievementsAndCertifications
            {
                AcademicAchievements = profile.AcademicAchievements,
                Scholarships = profile.Scholarships,
                RankOrMeritCertificates = profile.RankOrMeritCertificates,
                CompetitionsOrHackathons = profile.CompetitionsOrHackathons,
                SportsOrCulturalAchievements = profile.SportsOrCulturalAchievements,
                Certifications = profile.Certifications,
                CertificationCourseName = profile.CertificationCourseName,
                CertificationPlatform = profile.CertificationPlatform,
                CertificationYear = profile.CertificationYear
            },
            EntranceExams = new EntranceExams
            {
                AppearedForCompetitiveExams = profile.AppearedForCompetitiveExams,
                ExamName = profile.ExamName,
                ExamScoreOrRank = profile.ExamScoreOrRank,
                ExamYear = profile.ExamYear
            },
            CreatedAt = profile.CreatedAt,
            UpdatedAt = profile.UpdatedAt
        };
    }
}

