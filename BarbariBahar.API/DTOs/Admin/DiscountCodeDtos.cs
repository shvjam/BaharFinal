using System;
using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.DTOs.Admin
{
    public class CreateDiscountCodeDto
    {
        [Required]
        [MaxLength(50)]
        public string Code { get; set; }

        [Required]
        [RegularExpression("^(PERCENTAGE|FIXED)$", ErrorMessage = "نوع تخفیف باید PERCENTAGE یا FIXED باشد.")]
        public string Type { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "مقدار تخفیف باید مثبت باشد.")]
        public decimal Value { get; set; }

        public decimal? MaxDiscount { get; set; }
        public decimal? MinOrderAmount { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? UsageLimit { get; set; }
        public int? PerUserLimit { get; set; }

        [Required]
        public bool IsActive { get; set; }
    }

    public class UpdateDiscountCodeDto
    {
        [Required]
        [RegularExpression("^(PERCENTAGE|FIXED)$", ErrorMessage = "نوع تخفیف باید PERCENTAGE یا FIXED باشد.")]
        public string Type { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "مقدار تخفیف باید مثبت باشد.")]
        public decimal Value { get; set; }

        public decimal? MaxDiscount { get; set; }
        public decimal? MinOrderAmount { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? UsageLimit { get; set; }
        public int? PerUserLimit { get; set; }

        [Required]
        public bool IsActive { get; set; }
    }
}
