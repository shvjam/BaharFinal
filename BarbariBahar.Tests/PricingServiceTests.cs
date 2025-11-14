using Xunit;
using Moq;
using FluentAssertions;
using BarbariBahar.API.Services.Implementations;
using BarbariBahar.API.Data;
using BarbariBahar.API.Models;
using BarbariBahar.API.DTOs.Order;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BarbariBahar.API.Enums;
using System;
using Moq;
using Moq.EntityFrameworkCore;

namespace BarbariBahar.Tests
{
    public class PricingServiceTests
    {
        private readonly Mock<AppDbContext> _mockContext;
        private PricingService _pricingService;

        public PricingServiceTests()
        {
            var options = new DbContextOptions<AppDbContext>();
            _mockContext = new Mock<AppDbContext>(options);

            var pricingConfigs = new List<PricingConfig>
            {
                new PricingConfig
                {
                    IsActive = true,
                    BaseWorkerRate = 100000,
                    PerKmRate = 5000,
                    PerFloorRate = 20000,
                    StopRate = 50000,
                    PackingHourlyRate = 150000,
                    BaseVehicleRatesJson = "{\"PICKUP\":200000,\"NISSAN\":300000,\"TRUCK\":500000,\"HEAVY_TRUCK\":700000}",
                    WalkingDistanceRatesJson = "{}"
                }
            };
            _mockContext.Setup(c => c.PricingConfigs).ReturnsDbSet(pricingConfigs);
        }

        private void SetupDiscountCodes(List<DiscountCode> codes)
        {
            _mockContext.Setup(c => c.DiscountCodes).ReturnsDbSet(codes);
            _pricingService = new PricingService(_mockContext.Object);
        }

        [Fact]
        public async Task CalculateOrderPriceAsync_ShouldCalculateBaseVehiclePrice_WhenOnlyVehicleIsSelected()
        {
            // Arrange
            SetupDiscountCodes(new List<DiscountCode>());
            var orderDto = new CreateOrderDto
            {
                Details = new OrderDetailsDto { VehicleType = "TRUCK", WorkerCount = 0 },
                DistanceKm = 0
            };

            // Act
            var (finalPrice, discountAmount) = await _pricingService.CalculateOrderPriceAsync(orderDto);

            // Assert
            finalPrice.Should().Be(500000);
            discountAmount.Should().Be(0);
        }

        [Fact]
        public async Task CalculateOrderPriceAsync_ShouldAddWorkerAndDistanceCost()
        {
            // Arrange
            SetupDiscountCodes(new List<DiscountCode>());
            var orderDto = new CreateOrderDto
            {
                Details = new OrderDetailsDto { VehicleType = "NISSAN", WorkerCount = 2 },
                DistanceKm = 10
            };

            // Act
            var (finalPrice, discountAmount) = await _pricingService.CalculateOrderPriceAsync(orderDto);

            // Assert
            // 300,000 (Nissan) + 2 * 100,000 (Workers) + 10 * 5,000 (Distance) = 550,000
            finalPrice.Should().Be(550000);
        }

        [Fact]
        public async Task CalculateOrderPriceAsync_ShouldAddFloorCost_WhenNoElevator()
        {
            // Arrange
            SetupDiscountCodes(new List<DiscountCode>());
            var orderDto = new CreateOrderDto
            {
                Details = new OrderDetailsDto { VehicleType = "PICKUP", WorkerCount = 0 },
                DistanceKm = 0,
                LocationDetails = new CreateLocationDetailsDto
                {
                    OriginFloor = 3, OriginHasElevator = false,
                    DestinationFloor = 2, DestinationHasElevator = false
                }
            };

            // Act
            var (finalPrice, discountAmount) = await _pricingService.CalculateOrderPriceAsync(orderDto);

            // Assert
            // 200,000 (Pickup) + (3 + 2) * 20,000 (Floors) = 300,000
            finalPrice.Should().Be(300000);
        }

        [Fact]
        public async Task CalculateOrderPriceAsync_ShouldApplyPercentageDiscount()
        {
            // Arrange
            var discounts = new List<DiscountCode>
            {
                new DiscountCode { Code = "TEST10", Type = "PERCENTAGE", Value = 10, IsActive = true, MinOrderAmount = 100000 }
            };
            SetupDiscountCodes(discounts);

            var orderDto = new CreateOrderDto
            {
                Details = new OrderDetailsDto { VehicleType = "TRUCK", WorkerCount = 0 },
                DistanceKm = 0,
                DiscountCode = "TEST10"
            };

            // Act
            var (finalPrice, discountAmount) = await _pricingService.CalculateOrderPriceAsync(orderDto);

            // Assert
            // Base price: 500,000
            // Discount: 10% of 500,000 = 50,000
            // Final price: 450,000
            finalPrice.Should().Be(450000);
            discountAmount.Should().Be(50000);
        }

        [Fact]
        public async Task CalculateOrderPriceAsync_ShouldApplyFixedDiscount()
        {
            // Arrange
            var discounts = new List<DiscountCode>
            {
                new DiscountCode { Code = "FIX20", Type = "FIXED", Value = 20000, IsActive = true }
            };
            SetupDiscountCodes(discounts);

            var orderDto = new CreateOrderDto
            {
                Details = new OrderDetailsDto { VehicleType = "PICKUP", WorkerCount = 0 },
                DistanceKm = 0,
                DiscountCode = "FIX20"
            };

            // Act
            var (finalPrice, discountAmount) = await _pricingService.CalculateOrderPriceAsync(orderDto);

            // Assert
            // Base price: 200,000
            // Discount: 20,000
            // Final price: 180,000
            finalPrice.Should().Be(180000);
            discountAmount.Should().Be(20000);
        }

        [Fact]
        public async Task CalculateOrderPriceAsync_ShouldNotApplyExpiredDiscount()
        {
            // Arrange
            var discounts = new List<DiscountCode>
            {
                new DiscountCode { Code = "EXPIRED", Type = "PERCENTAGE", Value = 10, IsActive = true, EndDate = DateTime.UtcNow.AddDays(-1) }
            };
            SetupDiscountCodes(discounts);

            var orderDto = new CreateOrderDto
            {
                Details = new OrderDetailsDto { VehicleType = "TRUCK", WorkerCount = 0 },
                DistanceKm = 0,
                DiscountCode = "EXPIRED"
            };

            // Act
            var (finalPrice, discountAmount) = await _pricingService.CalculateOrderPriceAsync(orderDto);

            // Assert
            finalPrice.Should().Be(500000);
            discountAmount.Should().Be(0);
        }
    }
}
