using BarbariBahar.API.Enums;

namespace BarbariBahar.API.DTOs.Auth
{
    public class LoginResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? FullName { get; set; }
        public UserRole Role { get; set; }
    }
}