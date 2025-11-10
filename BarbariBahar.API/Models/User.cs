using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using BarbariBahar.API.Enums;

namespace BarbariBahar.API.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(11)]
        public string PhoneNumber { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? FullName { get; set; }

        [Required]
        public UserRole Role { get; set; } = UserRole.CUSTOMER;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation Properties
        public virtual ICollection<Address> Addresses { get; set; } = new List<Address>();
        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
        public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

        // برای رابطه یک به یک با Driver
        public virtual Driver? DriverProfile { get; set; }
    }
}