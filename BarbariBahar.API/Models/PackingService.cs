using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BarbariBahar.API.Enums;

namespace BarbariBahar.API.Models
{
    public class PackingService
    {
        [Key]
        [ForeignKey("Order")]
        public Guid OrderId { get; set; }

        [Required]
        public PackingType Type { get; set; }

        public int MaleWorkers { get; set; } = 0;
        public int FemaleWorkers { get; set; } = 0;

        public int EstimatedHours { get; set; }

        public bool NeedsMaterials { get; set; } = false;

        [MaxLength(20)]
        public string? MaterialsMode { get; set; } // "auto" یا "manual"

        // آیتم‌های بسته‌بندی (JSON)
        public string? PackingItemsJson { get; set; }

        // محصولات بسته‌بندی انتخاب شده (JSON)
        public string? PackingProductsJson { get; set; }

        // Navigation Property
        public virtual Order Order { get; set; } = null!;
    }
}