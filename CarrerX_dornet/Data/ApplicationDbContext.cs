using CareerX_dotnet.Model;
using Microsoft.EntityFrameworkCore;

namespace CareerX_dotnet.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions options) : base(options)
    {

    }

    public DbSet<Users> Users { get; set; }
    public DbSet<StudentProfile> StudentProfiles { get; set; }
    public DbSet<AssessmentSession> AssessmentSessions { get; set; }
    public DbSet<Blog> Blogs { get; set; }
    public DbSet<ExploreCareer> ExploreCareers { get; set; }
    public DbSet<Assessment> Assessments { get; set; }
    public DbSet<StudentAssessment> StudentAssessments { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<Roadmap> Roadmaps { get; set; }
    public DbSet<OTP> OTPs { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure StudentProfile relationship with Users
        modelBuilder.Entity<StudentProfile>()
            .HasOne(sp => sp.User)
            .WithMany()
            .HasForeignKey(sp => sp.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<StudentProfile>()
            .Property(s => s.OverallPercentageOrCGPA)
            .HasPrecision(5, 2);

        // Configure StudentAssessment relationships
        modelBuilder.Entity<StudentAssessment>()
            .HasOne(sa => sa.Student)
            .WithMany()
            .HasForeignKey(sa => sa.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<StudentAssessment>()
            .HasOne(sa => sa.Assessment)
            .WithMany()
            .HasForeignKey(sa => sa.AssessmentId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure Payment relationship
        modelBuilder.Entity<Payment>()
            .HasOne(p => p.Student)
            .WithMany()
            .HasForeignKey(p => p.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure Roadmap relationships
        modelBuilder.Entity<Roadmap>()
            .HasOne(r => r.Student)
            .WithMany()
            .HasForeignKey(r => r.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Roadmap>()
            .HasOne(r => r.Payment)
            .WithMany()
            .HasForeignKey(r => r.PaymentId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}