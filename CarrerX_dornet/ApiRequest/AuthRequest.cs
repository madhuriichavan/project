using CareerX_dotnet.Model.Enums;

namespace CareerX_dotnet.ApiRequest
{
    public class AuthRequest
    {
        public string Email { get; set; }

        public string Password { get; set; }

        public UserRole? role { get; set; }
    }
}
