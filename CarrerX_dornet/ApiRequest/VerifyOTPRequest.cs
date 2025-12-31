namespace CareerX_dotnet.ApiRequest;

public class VerifyOTPRequest
{
    public string Email { get; set; } = string.Empty;
    public string OtpCode { get; set; } = string.Empty;
}

