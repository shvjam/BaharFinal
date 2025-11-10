using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BarbariBahar.API.Data;
using BarbariBahar.API.DTOs.Common;
using BarbariBahar.API.DTOs.Order;
using BarbariBahar.API.Enums;
using BarbariBahar.API.Models;
using BarbariBahar.API.Services.Interfaces;
using Newtonsoft.Json;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IPricingService _pricingService;

        public OrdersController(AppDbContext context, IPricingService pricingService)
        {
            _context = context;
            _pricingService = pricingService;
        }

        // ثبت سفارش جدید
        [HttpPost]
        public async Task<ActionResult<ApiResponse<Order>>> CreateOrder([FromBody] CreateOrderDto dto)
        {
            try
            {
                var order = new Order
                {
                    CustomerPhone = dto.CustomerPhone,
                    CustomerName = dto.CustomerName,
                    ServiceCategoryId = dto.ServiceCategoryId,
                    PreferredDateTime = dto.PreferredDateTime,
                    DistanceKm = dto.DistanceKm,
                    EstimatedDuration = dto.EstimatedDuration,
                    Status = OrderStatus.PENDING,

                    // آدرس‌ها (ذخیره به صورت JSON)
                    OriginAddressJson = JsonConvert.SerializeObject(dto.OriginAddress),
                    DestinationAddressJson = JsonConvert.SerializeObject(dto.DestinationAddress),
                    StopsJson = dto.Stops != null ? JsonConvert.SerializeObject(dto.Stops) : null,

                    // جزئیات
                    DetailsJson = JsonConvert.SerializeObject(dto.Details),
                    CustomerNote = dto.CustomerNote
                };

                // محاسبه قیمت
                order.EstimatedPrice = await _pricingService.CalculateOrderPriceAsync(dto);

                // اگر کاربر لاگین کرده
                if (User.Identity?.IsAuthenticated == true)
                {
                    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                    if (userId != null)
                    {
                        order.CustomerId = Guid.Parse(userId);
                    }
                }

                await _context.Orders.AddAsync(order);
                await _context.SaveChangesAsync();

                // اضافه کردن آیتم‌ها
                if (dto.Items != null && dto.Items.Any())
                {
                    foreach (var itemDto in dto.Items)
                    {
                        var catalogItem = await _context.CatalogItems.FindAsync(itemDto.CatalogItemId);
                        if (catalogItem != null)
                        {
                            var orderItem = new OrderItem
                            {
                                OrderId = order.Id,
                                CatalogItemId = itemDto.CatalogItemId,
                                Quantity = itemDto.Quantity,
                                UnitPrice = catalogItem.BasePrice,
                                TotalPrice = catalogItem.BasePrice * itemDto.Quantity
                            };
                            await _context.OrderItems.AddAsync(orderItem);
                        }
                    }
                }

                // اضافه کردن سرویس بسته‌بندی
                if (dto.PackingService != null)
                {
                    var packingService = new PackingService
                    {
                        OrderId = order.Id,
                        Type = Enum.Parse<PackingType>(dto.PackingService.Type, true),
                        MaleWorkers = dto.PackingService.MaleWorkers,
                        FemaleWorkers = dto.PackingService.FemaleWorkers,
                        EstimatedHours = dto.PackingService.EstimatedHours,
                        NeedsMaterials = dto.PackingService.NeedsMaterials,
                        MaterialsMode = dto.PackingService.MaterialsMode,
                        PackingItemsJson = dto.PackingService.PackingItemsJson,
                        PackingProductsJson = dto.PackingService.PackingProductsJson
                    };
                    await _context.PackingServices.AddAsync(packingService);
                }

                // اضافه کردن جزئیات مکانی
                if (dto.LocationDetails != null)
                {
                    var locationDetails = new LocationDetails
                    {
                        OrderId = order.Id,
                        OriginFloor = dto.LocationDetails.OriginFloor,
                        OriginHasElevator = dto.LocationDetails.OriginHasElevator,
                        DestinationFloor = dto.LocationDetails.DestinationFloor,
                        DestinationHasElevator = dto.LocationDetails.DestinationHasElevator,
                        WalkDistanceMeters = dto.LocationDetails.WalkDistanceMeters,
                        StopCount = dto.LocationDetails.StopCount
                    };
                    await _context.LocationDetails.AddAsync(locationDetails);
                }

                await _context.SaveChangesAsync();

                return Ok(ApiResponse<Order>.SuccessResponse(order, "سفارش با موفقیت ثبت شد"));
            }
            catch (Exception ex)
            {
                // In a real scenario, log the exception
                return BadRequest(ApiResponse<Order>.ErrorResponse(ex.Message));
            }
        }

        // دریافت لیست سفارشات کاربر
        [Authorize(Roles = "CUSTOMER")]
        [HttpGet("my-orders")]
        public async Task<ActionResult<ApiResponse<List<Order>>>> GetMyOrders()
        {
            try
            {
                var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

                var orders = await _context.Orders
                    .Where(o => o.CustomerId == userId)
                    .Include(o => o.ServiceCategory)
                    .Include(o => o.Items)
                    .OrderByDescending(o => o.CreatedAt)
                    .ToListAsync();

                return Ok(ApiResponse<List<Order>>.SuccessResponse(orders));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<List<Order>>.ErrorResponse(ex.Message));
            }
        }

        // دریافت جزئیات سفارش
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<Order>>> GetOrderById(Guid id)
        {
            try
            {
                var order = await _context.Orders
                    .Include(o => o.ServiceCategory)
                    .Include(o => o.Items).ThenInclude(i => i.CatalogItem)
                    .Include(o => o.PackingService)
                    .Include(o => o.LocationDetails)
                    .Include(o => o.DriverAssignment).ThenInclude(da => da.Driver).ThenInclude(d => d.User)
                    .Include(o => o.Payment)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (order == null)
                    return NotFound(ApiResponse<Order>.ErrorResponse("سفارش یافت نشد"));

                return Ok(ApiResponse<Order>.SuccessResponse(order));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<Order>.ErrorResponse(ex.Message));
            }
        }
    }
}