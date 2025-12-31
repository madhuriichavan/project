using CareerX_dotnet.Data;
using CareerX_dotnet.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Razorpay.Api;
using PaymentModel = CareerX_dotnet.Model.Payment;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace CareerX_dotnet.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class PaymentController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public PaymentController(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    // POST: api/Payment/create-order (Create Razorpay order)
    [HttpPost("create-order")]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
    {
        var studentId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        
        // Amount should be in paise (smallest currency unit)
        var amountInPaise = (int)(request.Amount * 100);

        // Create order using Razorpay API
        var keyId = _configuration["Razorpay:KeyId"];
        var keySecret = _configuration["Razorpay:KeySecret"];

        string orderId;
        
        // Use Razorpay SDK to create order
        try
        {
            if (string.IsNullOrEmpty(keyId) || string.IsNullOrEmpty(keySecret))
            {
                throw new Exception("Razorpay credentials are not configured");
            }

            var razorpayClient = new RazorpayClient(keyId, keySecret);
            var orderRequest = new Dictionary<string, object>
            {
                { "amount", amountInPaise },
                { "currency", "INR" },
                { "receipt", $"receipt_{DateTime.UtcNow.Ticks}" }
            };
            
            var razorpayOrder = razorpayClient.Order.Create(orderRequest);
            
            if (razorpayOrder == null)
            {
                throw new Exception("Invalid response from Razorpay API - order is null");
            }
            
            // Razorpay SDK returns Order entity - try accessing Id property directly
            // If that doesn't work, fall back to dictionary access
            try
            {
                // Try property access first
                var orderIdProperty = razorpayOrder.GetType().GetProperty("Id");
                if (orderIdProperty != null)
                {
                    orderId = orderIdProperty.GetValue(razorpayOrder)?.ToString();
                }
                else
                {
                    // Fall back to dictionary-like access
                    dynamic dynamicOrder = razorpayOrder;
                    orderId = dynamicOrder["id"]?.ToString();
                }
                
                if (string.IsNullOrEmpty(orderId))
                {
                    throw new Exception("Order ID is null or empty in Razorpay response");
                }
            }
            catch
            {
                // Final fallback - use reflection to get any "id" or "Id" property
                var idValue = razorpayOrder.GetType().GetProperties()
                    .FirstOrDefault(p => p.Name.Equals("Id", StringComparison.OrdinalIgnoreCase))
                    ?.GetValue(razorpayOrder)?.ToString();
                
                orderId = idValue ?? throw new Exception("Could not extract Order ID from Razorpay response");
            }
        }
        catch (Exception ex)
        {
            // Log the error and return a meaningful error response
            Console.WriteLine($"Razorpay order creation failed: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            return BadRequest(new { message = "Failed to create payment order", error = ex.Message });
        }

        // Create payment record
        var payment = new PaymentModel
        {
            StudentId = studentId,
            Amount = request.Amount,
            RazorpayOrderId = orderId,
            RazorpayPaymentId = "", // Will be set after payment
            RazorpaySignature = "", // Will be set after payment
            PaymentStatus = "Pending",
            CreatedAt = DateTime.UtcNow
        };

        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            orderId = orderId,
            amount = amountInPaise,
            keyId = keyId,
            paymentId = payment.PaymentId,
            currency = "INR"
        });
    }

    // POST: api/Payment/verify (Verify payment)
    [HttpPost("verify")]
    public async Task<IActionResult> VerifyPayment([FromBody] VerifyPaymentRequest request)
    {
        var studentId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        
        var payment = await _context.Payments
            .FirstOrDefaultAsync(p => p.RazorpayOrderId == request.RazorpayOrderId && p.StudentId == studentId);

        if (payment == null)
        {
            return NotFound("Payment record not found.");
        }

        // Verify signature
        var keySecret = _configuration["Razorpay:KeySecret"];
        var signature = ComputeSignature(request.RazorpayOrderId, request.RazorpayPaymentId, keySecret);

        if (signature != request.RazorpaySignature)
        {
            return BadRequest("Invalid payment signature.");
        }

        // Update payment
        payment.RazorpayPaymentId = request.RazorpayPaymentId;
        payment.RazorpaySignature = request.RazorpaySignature;
        payment.PaymentStatus = "Completed";
        payment.CompletedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            paymentId = payment.PaymentId,
            message = "Payment verified successfully."
        });
    }

    // GET: api/Payment/history (Get payment history)
    [HttpGet("history")]
    public async Task<ActionResult<IEnumerable<object>>> GetPaymentHistory()
    {
        var studentId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        
        var payments = await _context.Payments
            .Where(p => p.StudentId == studentId)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new
            {
                paymentId = p.PaymentId,
                amount = p.Amount,
                status = p.PaymentStatus,
                createdAt = p.CreatedAt,
                completedAt = p.CompletedAt,
                orderId = p.RazorpayOrderId,
                receiptUrl = p.ReceiptUrl
            })
            .ToListAsync();

        return Ok(payments);
    }

    // GET: api/Payment/receipt/{paymentId} (Generate payment receipt)
    [HttpGet("receipt/{paymentId}")]
    public async Task<IActionResult> GetReceipt(int paymentId)
    {
        var studentId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        
        var payment = await _context.Payments
            .Include(p => p.Student)
            .FirstOrDefaultAsync(p => p.PaymentId == paymentId && p.StudentId == studentId && p.PaymentStatus == "Completed");

        if (payment == null)
        {
            return NotFound("Payment not found or not completed.");
        }

        // Generate receipt HTML
        var receiptHtml = $@"
<!DOCTYPE html>
<html>
<head>
    <title>Payment Receipt</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 20px; }}
        .receipt {{ border: 1px solid #ddd; padding: 20px; max-width: 600px; }}
        .header {{ text-align: center; color: #2F4156; }}
        .details {{ margin: 20px 0; }}
        .detail-row {{ display: flex; justify-content: space-between; margin: 10px 0; }}
    </style>
</head>
<body>
    <div class='receipt'>
        <h1 class='header'>Payment Receipt</h1>
        <div class='details'>
            <div class='detail-row'>
                <strong>Payment ID:</strong>
                <span>{payment.PaymentId}</span>
            </div>
            <div class='detail-row'>
                <strong>Order ID:</strong>
                <span>{payment.RazorpayOrderId}</span>
            </div>
            <div class='detail-row'>
                <strong>Amount:</strong>
                <span>₹{payment.Amount}</span>
            </div>
            <div class='detail-row'>
                <strong>Status:</strong>
                <span>{payment.PaymentStatus}</span>
            </div>
            <div class='detail-row'>
                <strong>Date:</strong>
                <span>{payment.CompletedAt:dd MMM yyyy HH:mm}</span>
            </div>
            <div class='detail-row'>
                <strong>Student:</strong>
                <span>{payment.Student?.Name}</span>
            </div>
        </div>
        <p style='text-align: center; margin-top: 30px; color: #666;'>
            Thank you for your payment!
        </p>
    </div>
</body>
</html>";

        // Save receipt URL (in production, upload to S3 or storage)
        if (string.IsNullOrEmpty(payment.ReceiptUrl))
        {
            payment.ReceiptUrl = $"receipt_{paymentId}.html";
            await _context.SaveChangesAsync();
        }

        return Content(receiptHtml, "text/html");
    }

    private string ComputeSignature(string orderId, string paymentId, string keySecret)
    {
        var message = $"{orderId}|{paymentId}";
        var keyBytes = Encoding.UTF8.GetBytes(keySecret);
        var messageBytes = Encoding.UTF8.GetBytes(message);

        using var hmac = new HMACSHA256(keyBytes);
        var hashBytes = hmac.ComputeHash(messageBytes);
        return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
    }
}

public class CreateOrderRequest
{
    public decimal Amount { get; set; }
}

public class VerifyPaymentRequest
{
    public string RazorpayOrderId { get; set; } = string.Empty;
    public string RazorpayPaymentId { get; set; } = string.Empty;
    public string RazorpaySignature { get; set; } = string.Empty;
}

