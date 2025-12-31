using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;

namespace CareerX_dotnet.Services;

public class EmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendEmailAsync(string to, string subject, string body, bool isHtml = true)
    {
        try
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(_configuration["Email:From"] ?? "careerx@example.com"));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;
            email.Body = new TextPart(isHtml ? TextFormat.Html : TextFormat.Plain)
            {
                Text = body
            };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(
                _configuration["Email:SmtpHost"] ?? "smtp.gmail.com",
                int.Parse(_configuration["Email:SmtpPort"] ?? "587"),
                SecureSocketOptions.StartTls
            );
            
            await smtp.AuthenticateAsync(
                _configuration["Email:Username"] ?? "",
                _configuration["Email:Password"] ?? ""
            );
            
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
        catch (Exception ex)
        {
            // Log error but don't throw - email sending failures shouldn't break the app
            Console.WriteLine($"Email sending failed: {ex.Message}");
        }
    }

    public async Task SendOTPEmailAsync(string to, string otp)
    {
        var subject = "CareerX - Password Reset OTP";
        var body = $@"
            <html>
            <body style='font-family: Arial, sans-serif;'>
                <h2>Password Reset Request</h2>
                <p>Your OTP for password reset is: <strong style='font-size: 24px; color: #2F4156;'>{otp}</strong></p>
                <p>This OTP will expire in 10 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <br/>
                <p>Best regards,<br/>CareerX Team</p>
            </body>
            </html>";
        
        await SendEmailAsync(to, subject, body);
    }

    public async Task SendRegistrationEmailAsync(string to, string studentName)
    {
        var subject = "Welcome to CareerX - Registration Successful!";
        var body = $@"
            <html>
            <body style='font-family: Arial, sans-serif; padding: 20px;'>
                <div style='max-width: 600px; margin: 0 auto;'>
                    <h2 style='color: #2F4156;'>Welcome to CareerX, {studentName}!</h2>
                    <p>Thank you for registering with CareerX. Your account has been successfully created.</p>
                    <p>To get started:</p>
                    <ol>
                        <li>Complete your student profile</li>
                        <li>Take the career assessment test</li>
                        <li>Receive personalized career recommendations</li>
                        <li>Subscribe to our career-path roadmap service</li>
                    </ol>
                    <p style='margin-top: 20px;'>
                        <a href='http://localhost:5173/login' style='background-color: #2F4156; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;'>Login to Your Dashboard</a>
                    </p>
                    <p style='margin-top: 20px; color: #666;'>
                        If you have any questions, feel free to contact us.
                    </p>
                    <br/>
                    <p>Best regards,<br/>CareerX Team</p>
                </div>
            </body>
            </html>";
        
        await SendEmailAsync(to, subject, body);
    }

    public async Task SendAssessmentReportEmailAsync(string to, string studentName, byte[] pdfBytes, decimal score)
    {
        try
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(_configuration["Email:From"] ?? "careerx@example.com"));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = "CareerX - Your Assessment Report is Ready!";

            var bodyBuilder = new BodyBuilder();
            bodyBuilder.HtmlBody = $@"
                <html>
                <body style='font-family: Arial, sans-serif; padding: 20px;'>
                    <div style='max-width: 600px; margin: 0 auto;'>
                        <h2 style='color: #2F4156;'>Hello {studentName},</h2>
                        <p>Your career assessment has been completed!</p>
                        <p><strong>Your Score: {score:F2}%</strong></p>
                        <p>We've generated a comprehensive assessment report based on your responses. Please find the detailed PDF report attached to this email.</p>
                        <p>The report includes:</p>
                        <ul>
                            <li>Your overall performance score</li>
                            <li>Personalized career recommendations</li>
                            <li>Identified strengths and areas for improvement</li>
                            <li>Next steps for your career journey</li>
                        </ul>
                        <p style='margin-top: 20px;'>
                            <a href='http://localhost:5173/studentdashboard' style='background-color: #2F4156; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;'>View in Dashboard</a>
                        </p>
                        <p style='margin-top: 20px; color: #666;'>
                            Ready to take the next step? Consider subscribing to our career-path roadmap service for detailed guidance on colleges, courses, and career progression.
                        </p>
                        <br/>
                        <p>Best regards,<br/>CareerX Team</p>
                    </div>
                </body>
                </html>";

            // Attach PDF
            bodyBuilder.Attachments.Add("Career_Assessment_Report.pdf", pdfBytes, ContentType.Parse("application/pdf"));
            
            email.Body = bodyBuilder.ToMessageBody();

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(
                _configuration["Email:SmtpHost"] ?? "smtp.gmail.com",
                int.Parse(_configuration["Email:SmtpPort"] ?? "587"),
                SecureSocketOptions.StartTls
            );
            
            await smtp.AuthenticateAsync(
                _configuration["Email:Username"] ?? "",
                _configuration["Email:Password"] ?? ""
            );
            
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to send assessment report email: {ex.Message}");
        }
    }

    public async Task SendRoadmapEmailAsync(string to, string studentName, string roadmapHtml)
    {
        var subject = "CareerX - Your Career Roadmap is Ready!";
        var body = $@"
            <html>
            <body style='font-family: Arial, sans-serif;'>
                <h2>Hello {studentName},</h2>
                <p>Your personalized career roadmap has been generated based on your assessment results.</p>
                <div style='margin: 20px 0; padding: 20px; background-color: #f5f5f5; border-radius: 5px;'>
                    {roadmapHtml}
                </div>
                <p>You can also view your roadmap in your dashboard.</p>
                <br/>
                <p>Best regards,<br/>CareerX Team</p>
            </body>
            </html>";
        
        await SendEmailAsync(to, subject, body);
    }
}

