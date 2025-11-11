using System;
using System.Collections.Generic;
using BarbariBahar.API.Enums;
using BarbariBahar.API.Models;

namespace BarbariBahar.API.DTOs.Order
{
    // DTO for representing an Order in API responses
    public class OrderResponseDto
    {
        public Guid Id { get; set; }
        public Guid? CustomerId { get; set; }
        public string CustomerPhone { get; set; }
        public string? CustomerName { get; set; }
        public Guid ServiceCategoryId { get; set; }
        public Guid? DriverId { get; set; }
        public OrderStatus Status { get; set; }
        public DateTime PreferredDateTime { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ConfirmedAt { get; set; }
        public DateTime? StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public decimal EstimatedPrice { get; set; }
        public decimal? FinalPrice { get; set; }
        public string? DiscountCode { get; set; }
        public decimal? DiscountAmount { get; set; }
        public OrderDetailsDto Details { get; set; }
        public CreateOrderAddressDto OriginAddress { get; set; }
        public CreateOrderAddressDto DestinationAddress { get; set; }
        public List<CreateOrderAddressDto>? Stops { get; set; }
        public double DistanceKm { get; set; }
        public int EstimatedDuration { get; set; }
        public string? CustomerNote { get; set; }
        public string? AdminNote { get; set; }
        public string? DriverNote { get; set; }
        public double? Rating { get; set; }
        public string? Review { get; set; }
        public string? CancellationReason { get; set; }
        public decimal? CancellationFee { get; set; }

        // Navigation Properties represented as DTOs
        public ServiceCategory ServiceCategory { get; set; }
        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
        public PackingServiceResponseDto? PackingService { get; set; }
        public LocationDetails? LocationDetails { get; set; }
        public DriverAssignment? DriverAssignment { get; set; }
        public Payment? Payment { get; set; }
    }

    // DTO for PackingService inside OrderResponseDto
    public class PackingServiceResponseDto
    {
        public Guid OrderId { get; set; }
        public PackingType Type { get; set; }
        public int MaleWorkers { get; set; }
        public int FemaleWorkers { get; set; }
        public int EstimatedHours { get; set; }
        public bool NeedsMaterials { get; set; }
        public string? MaterialsMode { get; set; }
        public object? PackingItems { get; set; } // Representing JSON as object
        public object? PackingProducts { get; set; } // Representing JSON as object
    }
}
