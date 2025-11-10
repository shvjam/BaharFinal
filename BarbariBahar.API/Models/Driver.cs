using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BarbariBahar.API.Enums;

namespace BarbariBahar.API.Models
{
    public class Driver
    {
        [Key]
        [ForeignKey("User")]
        public Guid UserId { get; set; }

        [MaxLength(10)]
        public string? NationalId { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [MaxLength(500)]
        public string? Address { get; set; }

        // وسیله نقلیه
        [Required]
        [MaxLength(20)]
        public string LicensePlate { get; set; } = string.Empty;

        [Required]
        public VehicleType VehicleType { get; set; }

        [MaxLength(50)]
        public string? VehicleModel { get; set; }

        [MaxLength(30)]
        public string? VehicleColor { get; set; }

        public int? VehicleYear { get; set; }

        public int AvailableWorkers { get; set; } = 0;

        // مدارک
        [MaxLength(50)]
        public string? DriverLicenseNumber { get; set; }

        public DateTime? DriverLicenseExpiry { get; set; }

        [MaxLength(500)]
        public string? DriverLicenseImage { get; set; }

        [MaxLength(500)]
        public string? VehicleCardImage { get; set; }

        [MaxLength(500)]
        public string? InsuranceImage { get; set; }

        [MaxLength(500)]
        public string? ProfileImage { get; set; }

        public bool DocumentsVerified { get; set; } = false;
        public DateTime? VerifiedAt { get; set; }

        // اطلاعات بانکی
        [MaxLength(24)]
        public string? Sheba { get; set; }

        // آمار و وضعیت
        [Range(0, 5)]
        public double Rating { get; set; } = 5.0;

        public int TotalRides { get; set; } = 0;
        public int CompletedRides { get; set; } = 0;
        public int CancelledRides { get; set; } = 0;

        public decimal TotalEarnings { get; set; } = 0;

        // تنظیمات
        public bool IsActive { get; set; } = false;
        public bool IsOnline { get; set; } = false;

        [Range(0, 100)]
        public double CommissionPercentage { get; set; } = 20.0; // درصد کمیسیون

        public int Priority { get; set; } = 0;

        // موقعیت فعلی
        public double? CurrentLat { get; set; }
        public double? CurrentLng { get; set; }
        public DateTime? LastLocationUpdate { get; set; }

        // یادداشت ادمین
        [MaxLength(1000)]
        public string? AdminNote { get; set; }

        // Navigation Properties
        public virtual User User { get; set; } = null!;
        public virtual ICollection<DriverAssignment> Assignments { get; set; } = new List<DriverAssignment>();
        public virtual ICollection<LocationUpdate> LocationUpdates { get; set; } = new List<LocationUpdate>();
    }
}