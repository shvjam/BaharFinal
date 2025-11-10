using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.DTOs.Auth
{
    public class SendOtpRequestDto
    {
        [Required(ErrorMessage = "شماره تلفن الزامی است")]
        [RegularExpression(@"^09\d{9}$", ErrorMessage = "فرمت شماره تلفن صحیح نیست")]
        public string PhoneNumber { get; set; } = string.Empty;
    }
}