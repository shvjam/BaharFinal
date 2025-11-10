using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarbariBahar.API.Models
{
    public class PricingConfig
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = "پیش‌فرض";

        public decimal BaseWorkerRate { get; set; }

        // نرخ هر نوع خودرو (JSON)
        [Required]
        public string BaseVehicleRatesJson { get; set; } = "{}";

        public decimal PerKmRate { get; set; }

        public decimal PerFloorRate { get; set; }

        // نرخ پیاده‌روی (JSON)
        public string WalkingDistanceRatesJson { get; set; } = "{}";

        public decimal StopRate { get; set; }

        public decimal PackingHourlyRate { get; set; }

        public decimal CancellationFee { get; set; }

        public decimal ExpertVisitFee { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}