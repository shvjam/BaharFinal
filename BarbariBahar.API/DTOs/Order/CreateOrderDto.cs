using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using BarbariBahar.API.Enums;

namespace BarbariBahar.API.DTOs.Order
{
    public class CreateOrderDto
    {
        [Required]
        public string CustomerPhone { get; set; } = string.Empty;

        public string? CustomerName { get; set; }

        [Required]
        public Guid ServiceCategoryId { get; set; }

        [Required]
        public DateTime PreferredDateTime { get; set; }

        [Required]
        public CreateOrderAddressDto OriginAddress { get; set; } = null!;

        [Required]
        public CreateOrderAddressDto DestinationAddress { get; set; } = null!;

        public List<CreateOrderAddressDto>? Stops { get; set; }

        [Required]
        public double DistanceKm { get; set; }

        public int EstimatedDuration { get; set; }

        [Required]
        public OrderDetailsDto Details { get; set; } = null!;

        public List<CreateOrderItemDto>? Items { get; set; }

        public CreatePackingServiceDto? PackingService { get; set; }

        public CreateLocationDetailsDto? LocationDetails { get; set; }

        public string? CustomerNote { get; set; }

        public string? DiscountCode { get; set; }
    }

    public class CreateOrderAddressDto
    {
        public string Title { get; set; } = string.Empty;
        public string FullAddress { get; set; } = string.Empty;
        public double Lat { get; set; }
        public double Lng { get; set; }
        public string District { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;
        public string? PostalCode { get; set; }
        public string? Details { get; set; }
    }

    public class OrderDetailsDto
    {
        public bool NeedsPacking { get; set; }
        public bool NeedsWorkers { get; set; }
        public int WorkerCount { get; set; }
        public string VehicleType { get; set; } = string.Empty;
    }

    public class CreateOrderItemDto
    {
        public Guid CatalogItemId { get; set; }
        public int Quantity { get; set; }
    }

    public class CreatePackingServiceDto
    {
        public PackingType Type { get; set; }
        public int MaleWorkers { get; set; }
        public int FemaleWorkers { get; set; }
        public int EstimatedHours { get; set; }
        public bool NeedsMaterials { get; set; }
        public string? MaterialsMode { get; set; }
        public string? PackingItemsJson { get; set; }
        public string? PackingProductsJson { get; set; }
    }

    public class CreateLocationDetailsDto
    {
        public int OriginFloor { get; set; }
        public bool OriginHasElevator { get; set; }
        public int DestinationFloor { get; set; }
        public bool DestinationHasElevator { get; set; }
        public int WalkDistanceMeters { get; set; }
        public int StopCount { get; set; }
    }
}