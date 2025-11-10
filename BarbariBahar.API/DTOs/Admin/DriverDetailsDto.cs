using System;
using BarbariBahar.API.Enums;
using BarbariBahar.API.Models;

namespace BarbariBahar.API.DTOs.Admin
{
    public class DriverDetailsDto
    {
        // User Info
        public Guid UserId { get; set; }
        public string PhoneNumber { get; set; }
        public string? FullName { get; set; }

        // Driver Info
        public string? NationalId { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Address { get; set; }
        public string LicensePlate { get; set; }
        public VehicleType VehicleType { get; set; }
        public string? VehicleModel { get; set; }
        public bool DocumentsVerified { get; set; }
        public double Rating { get; set; }
        public bool IsActive { get; set; }
        public bool IsOnline { get; set; }

        public static DriverDetailsDto FromDriver(Driver driver)
        {
            return new DriverDetailsDto
            {
                UserId = driver.UserId,
                PhoneNumber = driver.User.PhoneNumber,
                FullName = driver.User.FullName,
                NationalId = driver.NationalId,
                DateOfBirth = driver.DateOfBirth,
                Address = driver.Address,
                LicensePlate = driver.LicensePlate,
                VehicleType = driver.VehicleType,
                VehicleModel = driver.VehicleModel,
                DocumentsVerified = driver.DocumentsVerified,
                Rating = driver.Rating,
                IsActive = driver.IsActive,
                IsOnline = driver.IsOnline
            };
        }
    }
}
