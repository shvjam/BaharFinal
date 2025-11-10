using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarbariBahar.API.Models
{
    public class CatalogItem
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid CategoryId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        public decimal BasePrice { get; set; }

        [Required]
        [MaxLength(50)]
        public string Unit { get; set; } = "عدد";

        public bool IsActive { get; set; } = true;

        public int Order { get; set; } = 0;

        // Navigation Property
        [ForeignKey("CategoryId")]
        public virtual CatalogCategory Category { get; set; } = null!;
    }
}