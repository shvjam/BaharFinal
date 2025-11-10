using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.DTOs.Auth
{
    public class LoginRequestDto
    {
        [Required(ErrorMessage = "شماره تلفن الزامی است")]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "کد تایید الزامی است")]
        [StringLength(4, MinimumLength = 4, ErrorMessage = "کد تایید باید 4 رقم باشد")]
        public string Otp { get; set; } = string.Empty;
    }
}