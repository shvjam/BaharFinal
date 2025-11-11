using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.DTOs.Admin
{
    public class UpdateDriverByAdminDto
    {
        [Required]
        public bool IsActive { get; set; }

        [Required]
        [Range(0, 100, ErrorMessage = "درصد کمیسیون باید بین 0 تا 100 باشد.")]
        public double CommissionPercentage { get; set; }

        [MaxLength(1000, ErrorMessage = "یادداشت ادمین نمی‌تواند بیشتر از 1000 کاراکتر باشد.")]
        public string? AdminNote { get; set; }
    }
}
