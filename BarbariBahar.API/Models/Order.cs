using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BarbariBahar.API.Enums;

namespace BarbariBahar.API.Models
{
    public class Order
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid? CustomerId { get; set; }

        [Required]
        [MaxLength(11)]
        public string CustomerPhone { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? CustomerName { get; set; }

        [Required]
        public Guid ServiceCategoryId { get; set; }

        public Guid? DriverId { get; set; }

        [Required]
        public OrderStatus Status { get; set; } = OrderStatus.DRAFT;

        // زمان‌بندی
        [Required]
        public DateTime PreferredDateTime { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ConfirmedAt { get; set; }
        public DateTime? StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }

        // قیمت
        [Required]
        public decimal EstimatedPrice { get; set; }

        public decimal? FinalPrice { get; set; }

        [MaxLength(50)]
        public string? DiscountCode { get; set; }

        public decimal? DiscountAmount { get; set; }

        // جزئیات سفارش (JSON)
        public string DetailsJson { get; set; } = "{}";

        // آدرس‌ها (JSON - فقط برای ذخیره snapshot)
        [Required]
        public string OriginAddressJson { get; set; } = "{}";

        [Required]
        public string DestinationAddressJson { get; set; } = "{}";

        public string? StopsJson { get; set; }

        // فاصله و زمان
        [Required]
        public double DistanceKm { get; set; }

        public int EstimatedDuration { get; set; } // دقیقه

        // یادداشت‌ها
        [MaxLength(1000)]
        public string? CustomerNote { get; set; }

        [MaxLength(1000)]
        public string? AdminNote { get; set; }

        [MaxLength(1000)]
        public string? DriverNote { get; set; }

        // امتیاز
        [Range(0, 5)]
        public double? Rating { get; set; }

        [MaxLength(1000)]
        public string? Review { get; set; }

        // لغو
        [MaxLength(500)]
        public string? CancellationReason { get; set; }

        public decimal? CancellationFee { get; set; }

        // Navigation Properties
        [ForeignKey("CustomerId")]
        public virtual User? Customer { get; set; }

        [ForeignKey("ServiceCategoryId")]
        public virtual ServiceCategory ServiceCategory { get; set; } = null!;

        public virtual ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
        public virtual PackingService? PackingService { get; set; }
        public virtual LocationDetails? LocationDetails { get; set; }
        public virtual DriverAssignment? DriverAssignment { get; set; }
        public virtual Payment? Payment { get; set; }
    }
}