using CareerX_dotnet.Model.Enums;
using System.ComponentModel.DataAnnotations;

namespace CareerX_dotnet.ApiRequest
{
    public class UserRequest
    {

        public string Name { get; set; }

        public string Password { get; set; }


        public string Email { get; set; }


        public int Age { get; set; }

        public UserRole Role { get; set; } = UserRole.Student;

        public string Location { get; set; }
    }
}
