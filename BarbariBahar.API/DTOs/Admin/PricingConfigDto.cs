using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.DTOs.Admin
{
    public class PricingConfigDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        public decimal BaseWorkerRate { get; set; }

        [Required]
        public string BaseVehicleRatesJson { get; set; }

        [Required]
        public decimal PerKmRate { get; set; }

        [Required]
        public decimal PerFloorRate { get; set; }

        [Required]
        public string WalkingDistanceRatesJson { get; set; }

        [Required]
        public decimal StopRate { get; set; }

        [Required]
        public decimal PackingHourlyRate { get; set; }

        [Required]
        public decimal CancellationFee { get; set; }

        [Required]
        public decimal ExpertVisitFee { get; set; }

        [Required]
        public bool IsActive { get; set; }
    }
}
