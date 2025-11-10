using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarbariBahar.API.Models
{
    public class DiscountCode
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(50)]
        public string Code { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Type { get; set; } = "PERCENTAGE"; // PERCENTAGE یا FIXED

        [Required]
        public decimal Value { get; set; }

        public decimal? MaxDiscount { get; set; }

        public decimal? MinOrderAmount { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public int? UsageLimit { get; set; }
        public int UsageCount { get; set; } = 0;

        public int? PerUserLimit { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}