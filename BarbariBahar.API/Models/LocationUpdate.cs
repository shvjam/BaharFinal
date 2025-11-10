using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarbariBahar.API.Models
{
    public class LocationUpdate
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid DriverId { get; set; }

        [Required]
        public Guid OrderId { get; set; }

        [Required]
        public double Lat { get; set; }

        [Required]
        public double Lng { get; set; }

        public double? Heading { get; set; }
        public double? Speed { get; set; }
        public double? Accuracy { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        // Navigation Property
        [ForeignKey("DriverId")]
        public virtual Driver Driver { get; set; } = null!;
    }
}