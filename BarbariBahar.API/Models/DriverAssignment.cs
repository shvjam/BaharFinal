using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarbariBahar.API.Models
{
    public class DriverAssignment
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid OrderId { get; set; }

        [Required]
        public Guid DriverId { get; set; }

        [Required]
        [Range(0, 100)]
        public double Commission { get; set; } // درصد

        public decimal? CommissionAmount { get; set; }

        [MaxLength(500)]
        public string? Note { get; set; }

        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
        public DateTime? AcceptedAt { get; set; }
        public DateTime? RejectedAt { get; set; }

        [MaxLength(500)]
        public string? RejectionReason { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation Properties
        [ForeignKey("OrderId")]
        public virtual Order Order { get; set; } = null!;

        [ForeignKey("DriverId")]
        public virtual Driver Driver { get; set; } = null!;
    }
}