using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarbariBahar.API.Models
{
    public class PackingProduct
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        public decimal Price { get; set; }

        [Required]
        [MaxLength(50)]
        public string Unit { get; set; } = "عدد";

        [MaxLength(500)]
        public string? Image { get; set; }

        public int Stock { get; set; } = 0;

        public bool IsActive { get; set; } = true;
    }
}