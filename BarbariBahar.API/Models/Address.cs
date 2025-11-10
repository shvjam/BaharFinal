using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarbariBahar.API.Models
{
    public class Address
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string FullAddress { get; set; } = string.Empty;

        [Required]
        public double Lat { get; set; }

        [Required]
        public double Lng { get; set; }

        [Required]
        [MaxLength(50)]
        public string District { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string City { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Province { get; set; } = string.Empty;

        [MaxLength(10)]
        public string? PostalCode { get; set; }

        [MaxLength(500)]
        public string? Details { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Property
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;
    }
}