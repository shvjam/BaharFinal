using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.DTOs.User
{
    public class UpdateProfileDto
    {
        [MaxLength(100, ErrorMessage = "نام و نام خانوادگی نمی‌تواند بیش از ۱۰۰ کاراکتر باشد.")]
        public string? FullName { get; set; }
    }
}
