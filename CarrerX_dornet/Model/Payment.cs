using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareerX_dotnet.Model;

public class Payment
{
    [Key]
    public int PaymentId { get; set; }
    
    [Required]
    public int StudentId { get; set; }
    
    [ForeignKey("StudentId")]
    public Users Student { get; set; }
    
    [Required]
    public decimal Amount { get; set; }
    
    [Required]
    public string RazorpayOrderId { get; set; } = string.Empty;
    
    [Required]
    public string RazorpayPaymentId { get; set; } = string.Empty;
    
    [Required]
    public string RazorpaySignature { get; set; } = string.Empty;
    
    public string PaymentStatus { get; set; } = "Pending"; // Pending, Completed, Failed
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? CompletedAt { get; set; }
    
    public string? ReceiptUrl { get; set; }
}

