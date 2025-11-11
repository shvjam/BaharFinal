using BarbariBahar.API.Enums;
using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.DTOs.Admin
{
    public class UpdateUserByAdminDto
    {
        [Required]
        [EnumDataType(typeof(UserRole), ErrorMessage = "نقش کاربری معتبر نیست.")]
        public UserRole Role { get; set; }
    }
}
