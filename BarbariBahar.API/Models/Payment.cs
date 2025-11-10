using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BarbariBahar.API.Enums;

namespace BarbariBahar.API.Models
{
    public class Payment
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid OrderId { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public PaymentStatus Status { get; set; } = PaymentStatus.PENDING;

        [Required]
        public PaymentMethod Method { get; set; }

        [MaxLength(100)]
        public string? GatewayTransactionId { get; set; }

        public string? GatewayResponseJson { get; set; }

        public DateTime? PaidAt { get; set; }
        public DateTime? RefundedAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Property
        [ForeignKey("OrderId")]
        public virtual Order Order { get; set; } = null!;
    }
}