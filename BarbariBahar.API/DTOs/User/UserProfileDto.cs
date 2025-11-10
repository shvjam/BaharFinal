using System;
using BarbariBahar.API.Enums;

namespace BarbariBahar.API.DTOs.User
{
    public class UserProfileDto
    {
        public Guid Id { get; set; }
        public string PhoneNumber { get; set; }
        public string? FullName { get; set; }
        public UserRole Role { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
