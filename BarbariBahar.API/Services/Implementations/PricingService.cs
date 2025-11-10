using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using BarbariBahar.API.Data;
using BarbariBahar.API.DTOs.Order;
using BarbariBahar.API.Enums;
using BarbariBahar.API.Models;
using BarbariBahar.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BarbariBahar.API.Services.Implementations
{
    public class PricingService : IPricingService
    {
        private readonly AppDbContext _context;

        public PricingService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<decimal> CalculateOrderPriceAsync(CreateOrderDto orderDto)
        {
            var breakdown = await GetPriceBreakdownAsync(orderDto);
            return breakdown.Sum(item => item.TotalPrice);
        }

        public async Task<List<PriceBreakdownDto>> GetPriceBreakdownAsync(CreateOrderDto orderDto)
        {
            var breakdown = new List<PriceBreakdownDto>();

            var config = await _context.PricingConfigs.FirstOrDefaultAsync(p => p.IsActive);
            if (config == null)
            {
                throw new InvalidOperationException("No active pricing configuration found.");
            }

            // 1. Vehicle Base Rate
            if (Enum.TryParse<VehicleType>(orderDto.Details.VehicleType, true, out var vehicleType))
            {
                var vehicleRates = JsonSerializer.Deserialize<Dictionary<string, decimal>>(config.BaseVehicleRatesJson);
                if (vehicleRates != null && vehicleRates.TryGetValue(vehicleType.ToString().ToUpper(), out var baseRate))
                {
                    breakdown.Add(new PriceBreakdownDto
                    {
                        Label = $"هزینه پایه خودرو ({GetVehicleTypeName(vehicleType)})",
                        Quantity = 1,
                        UnitPrice = baseRate,
                        TotalPrice = baseRate,
                        Description = "هزینه اولیه بر اساس نوع خودروی انتخابی"
                    });
                }
            }

            // 2. Distance Rate
            if (orderDto.DistanceKm > 0)
            {
                var distanceCost = (decimal)orderDto.DistanceKm * config.PerKmRate;
                breakdown.Add(new PriceBreakdownDto
                {
                    Label = "هزینه مسافت",
                    Quantity = (int)Math.Ceiling(orderDto.DistanceKm),
                    UnitPrice = config.PerKmRate,
                    TotalPrice = distanceCost,
                    Description = $"بر اساس هر کیلومتر {config.PerKmRate:N0} تومان"
                });
            }

            // 3. Workers Rate
            if (orderDto.Details.WorkerCount > 0)
            {
                var workerCost = orderDto.Details.WorkerCount * config.BaseWorkerRate;
                breakdown.Add(new PriceBreakdownDto
                {
                    Label = "هزینه کارگر",
                    Quantity = orderDto.Details.WorkerCount,
                    UnitPrice = config.BaseWorkerRate,
                    TotalPrice = workerCost,
                    Description = "شامل ۳ ساعت اولیه کاری برای هر کارگر"
                });
            }

            // 4. Floor Rate
            if (orderDto.LocationDetails != null)
            {
                var totalFloors = 0;
                if (!orderDto.LocationDetails.OriginHasElevator) totalFloors += orderDto.LocationDetails.OriginFloor;
                if (!orderDto.LocationDetails.DestinationHasElevator) totalFloors += orderDto.LocationDetails.DestinationFloor;

                if (totalFloors > 0)
                {
                    var floorCost = totalFloors * config.PerFloorRate;
                    breakdown.Add(new PriceBreakdownDto
                    {
                        Label = "هزینه طبقات (بدون آسانسور)",
                        Quantity = totalFloors,
                        UnitPrice = config.PerFloorRate,
                        TotalPrice = floorCost,
                        Description = "برای حمل بار در طبقات مبدا و مقصد"
                    });
                }
            }

            // 5. Stops Rate
            if (orderDto.Stops != null && orderDto.Stops.Any())
            {
                var stopCost = orderDto.Stops.Count * config.StopRate;
                breakdown.Add(new PriceBreakdownDto
                {
                    Label = "هزینه توقف در مسیر",
                    Quantity = orderDto.Stops.Count,
                    UnitPrice = config.StopRate,
                    TotalPrice = stopCost
                });
            }

            // 6. Packing Service Rate
            if (orderDto.PackingService != null && orderDto.PackingService.EstimatedHours > 0)
            {
                var packingCost = orderDto.PackingService.EstimatedHours * config.PackingHourlyRate;
                breakdown.Add(new PriceBreakdownDto
                {
                    Label = "هزینه سرویس بسته‌بندی",
                    Quantity = orderDto.PackingService.EstimatedHours,
                    UnitPrice = config.PackingHourlyRate,
                    TotalPrice = packingCost,
                    Description = "بر اساس هر ساعت"
                });
            }

            return breakdown;
        }

        private string GetVehicleTypeName(VehicleType type)
        {
            return type switch
            {
                VehicleType.PICKUP => "وانت",
                VehicleType.NISSAN => "نیسان",
                VehicleType.TRUCK => "کامیون",
                VehicleType.HEAVY_TRUCK => "خاور",
                _ => ""
            };
        }
    }
}