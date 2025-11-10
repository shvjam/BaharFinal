using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.Models
{
    public class CatalogCategory
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Slug { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        public int Order { get; set; } = 0;

        // Navigation Properties
        public virtual ICollection<CatalogItem> Items { get; set; } = new List<CatalogItem>();
    }
}