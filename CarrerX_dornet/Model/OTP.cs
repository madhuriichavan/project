using System.ComponentModel.DataAnnotations;

namespace CareerX_dotnet.Model;

public class OTP
{
    [Key]
    public int OtpId { get; set; }
    
    [Required]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    public string OtpCode { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime ExpiresAt { get; set; }
    
    public bool IsUsed { get; set; } = false;
}

