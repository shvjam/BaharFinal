using System;
using System.Collections.Generic;
using BarbariBahar.API.Enums;
using BarbariBahar.API.Models;

namespace BarbariBahar.API.DTOs.Driver
{
    public class LocationDto
    {
        public double Lat { get; set; }
        public double Lng { get; set; }
    }

    public class DriverResponseDto
    {
        public Guid UserId { get; set; }
        public string PhoneNumber { get; set; }
        public string? FullName { get; set; }
        public UserRole Role { get; set; }
        public string LicensePlate { get; set; }
        public VehicleType VehicleType { get; set; }
        public double Rating { get; set; }
        public int TotalRides { get; set; }
        public bool IsActive { get; set; }
        public bool IsOnline { get; set; }
        public LocationDto? CurrentLocation { get; set; }
        public DateTime CreatedAt { get; set; }
        public ICollection<DriverAssignment> Assignments { get; set; } = new List<DriverAssignment>();
    }
}
