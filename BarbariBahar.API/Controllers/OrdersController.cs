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
using BarbariBahar.API.DTOs.Admin;

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

        // POST: api/orders
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
                    OriginAddressJson = JsonConvert.SerializeObject(dto.OriginAddress),
                    DestinationAddressJson = JsonConvert.SerializeObject(dto.DestinationAddress),
                    StopsJson = dto.Stops != null ? JsonConvert.SerializeObject(dto.Stops) : null,
                    DetailsJson = JsonConvert.SerializeObject(dto.Details),
                    CustomerNote = dto.CustomerNote
                };

                order.EstimatedPrice = await _pricingService.CalculateOrderPriceAsync(dto);

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
                return BadRequest(ApiResponse<Order>.ErrorResponse(ex.Message));
            }
        }

        // GET: api/orders/my-orders
        [Authorize(Roles = "CUSTOMER")]
        [HttpGet("my-orders")]
        public async Task<ActionResult<ApiResponse<List<Order>>>> GetMyOrders()
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var orders = await _context.Orders
                .Where(o => o.CustomerId == userId)
                .Include(o => o.ServiceCategory)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
            return Ok(ApiResponse<List<Order>>.SuccessResponse(orders));
        }

        // GET: api/orders/{id}
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<Order>>> GetOrderById(Guid id)
        {
            var order = await _context.Orders
                .Include(o => o.ServiceCategory)
                .Include(o => o.DriverAssignment).ThenInclude(da => da.Driver).ThenInclude(d => d.User)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound(ApiResponse<Order>.ErrorResponse("سفارش یافت نشد"));

            var currentUserId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            if (User.IsInRole(UserRole.CUSTOMER.ToString()) && order.CustomerId != currentUserId)
            {
                return Forbid();
            }
            if (User.IsInRole(UserRole.DRIVER.ToString()) && order.DriverId != currentUserId)
            {
                return Forbid();
            }

            return Ok(ApiResponse<Order>.SuccessResponse(order));
        }

        // POST: api/orders/{id}/assign-driver
        [Authorize(Roles = "ADMIN")]
        [HttpPost("{id}/assign-driver")]
        public async Task<ActionResult<ApiResponse<string>>> AssignDriver(Guid id, [FromBody] AssignDriverDto dto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound(ApiResponse<string>.ErrorResponse("سفارش یافت نشد."));
            }

            var driver = await _context.Drivers.FindAsync(dto.DriverId);
            if (driver == null)
            {
                return NotFound(ApiResponse<string>.ErrorResponse("راننده یافت نشد."));
            }

            order.DriverId = dto.DriverId;
            order.Status = OrderStatus.DRIVER_ASSIGNED;

            var assignment = new DriverAssignment
            {
                OrderId = order.Id,
                DriverId = driver.UserId,
                Commission = driver.CommissionPercentage,
                AssignedAt = DateTime.UtcNow
            };

            await _context.DriverAssignments.AddAsync(assignment);
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<string>.SuccessResponse(null, "راننده با موفقیت به سفارش تخصیص داده شد."));
        }

        // PATCH: api/orders/{id}/status
        [Authorize(Roles = "ADMIN,DRIVER")]
        [HttpPatch("{id}/status")]
        public async Task<ActionResult<ApiResponse<string>>> UpdateOrderStatus(Guid id, [FromBody] UpdateOrderStatusDto dto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound(ApiResponse<string>.ErrorResponse("سفارش یافت نشد."));
            }

            order.Status = dto.Status;

            switch (dto.Status)
            {
                case OrderStatus.CONFIRMED:
                    order.ConfirmedAt = DateTime.UtcNow;
                    break;
                case OrderStatus.DRIVER_EN_ROUTE_TO_ORIGIN:
                    order.StartedAt ??= DateTime.UtcNow;
                    break;
                case OrderStatus.COMPLETED:
                    order.CompletedAt = DateTime.UtcNow;
                    break;
            }

            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<string>.SuccessResponse(null, "وضعیت سفارش با موفقیت به‌روزرسانی شد."));
        }
    }
}
