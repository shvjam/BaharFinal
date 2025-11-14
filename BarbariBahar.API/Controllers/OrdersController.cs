using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using BarbariBahar.API.Data;
using BarbariBahar.API.DTOs.Admin;
using BarbariBahar.API.DTOs.Common;
using BarbariBahar.API.DTOs.Order;
using BarbariBahar.API.Enums;
using BarbariBahar.API.Models;
using BarbariBahar.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IPricingService _pricingService;
        private readonly INotificationService _notificationService;
        private readonly IMapper _mapper;

        public OrdersController(AppDbContext context, IPricingService pricingService, INotificationService notificationService, IMapper mapper)
        {
            _context = context;
            _pricingService = pricingService;
            _notificationService = notificationService;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<Order>>> CreateOrder([FromBody] CreateOrderDto dto)
        {
            var (estimatedPrice, discountAmount) = await _pricingService.CalculateOrderPriceAsync(dto);

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
                CustomerNote = dto.CustomerNote,
                EstimatedPrice = estimatedPrice,
                DiscountAmount = discountAmount,
                DiscountCode = !string.IsNullOrEmpty(dto.DiscountCode) && discountAmount > 0 ? dto.DiscountCode.ToUpper() : null
            };

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
                    Type = dto.PackingService.Type,
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

        [Authorize(Roles = "CUSTOMER")]
        [HttpGet("my-orders")]
        public async Task<ActionResult<ApiResponse<List<OrderResponseDto>>>> GetMyOrders()
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var orders = await _context.Orders
                .Where(o => o.CustomerId == userId)
                .Include(o => o.ServiceCategory)
                .Include(o => o.Items)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            var orderDtos = _mapper.Map<List<OrderResponseDto>>(orders);
            return Ok(ApiResponse<List<OrderResponseDto>>.SuccessResponse(orderDtos));
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<OrderResponseDto>>> GetOrderById(Guid id)
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
                return NotFound(ApiResponse<OrderResponseDto>.ErrorResponse("سفارش یافت نشد"));

            var orderDto = _mapper.Map<OrderResponseDto>(order);
            return Ok(ApiResponse<OrderResponseDto>.SuccessResponse(orderDto));
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPost("{id}/assign-driver")]
        public async Task<ActionResult<ApiResponse<DriverAssignment>>> AssignDriver(Guid id, [FromBody] AssignDriverDto dto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound(ApiResponse<DriverAssignment>.ErrorResponse("سفارش یافت نشد."));
            }

            var driver = await _context.Drivers.FindAsync(dto.DriverId);
            if (driver == null)
            {
                return NotFound(ApiResponse<DriverAssignment>.ErrorResponse("راننده یافت نشد."));
            }

            var assignment = new DriverAssignment
            {
                OrderId = id,
                DriverId = dto.DriverId,
                Commission = driver.CommissionPercentage,
                Note = dto.Note,
                IsActive = true
            };

            order.Status = OrderStatus.DRIVER_ASSIGNED;
            order.DriverId = dto.DriverId;

            await _context.DriverAssignments.AddAsync(assignment);
            await _context.SaveChangesAsync();

            await _notificationService.SendNotificationAsync(
                driver.UserId,
                "INFO",
                "سفارش جدید",
                $"یک سفارش جدید به شما اختصاص یافت. لطفاً جهت مشاهده جزئیات و قبول یا رد آن، به پنل خود مراجعه کنید.",
                new { orderId = order.Id }
            );

            if (order.CustomerId.HasValue)
            {
                await _notificationService.SendNotificationAsync(
                    order.CustomerId.Value,
                    "SUCCESS",
                    "راننده مشخص شد",
                    $"راننده سفارش شما مشخص شد. می‌توانید جزئیات راننده را در صفحه سفارش مشاهده کنید.",
                    new { orderId = order.Id }
                );
            }

            return Ok(ApiResponse<DriverAssignment>.SuccessResponse(assignment, "راننده با موفقیت به سفارش اختصاص یافت."));
        }

        [Authorize(Roles = "ADMIN,DRIVER")]
        [HttpPatch("{id}/status")]
        public async Task<ActionResult<ApiResponse<string>>> UpdateOrderStatus(Guid id, [FromBody] UpdateOrderStatusDto dto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound(ApiResponse<string>.ErrorResponse("سفارش یافت نشد."));
            }

            var currentStatus = order.Status;
            var newStatus = dto.Status;

            var isValidTransition = (currentStatus, newStatus) switch
            {
                (OrderStatus.PENDING, OrderStatus.CONFIRMED) => User.IsInRole("ADMIN"),
                (OrderStatus.CONFIRMED, OrderStatus.CANCELLED) => true,
                (OrderStatus.DRIVER_ASSIGNED, OrderStatus.DRIVER_EN_ROUTE_TO_ORIGIN) => true,
                (OrderStatus.DRIVER_EN_ROUTE_TO_ORIGIN, OrderStatus.PACKING_IN_PROGRESS) => true,
                (OrderStatus.PACKING_IN_PROGRESS, OrderStatus.LOADING_IN_PROGRESS) => true,
                (OrderStatus.LOADING_IN_PROGRESS, OrderStatus.IN_TRANSIT) => true,
                (OrderStatus.IN_TRANSIT, OrderStatus.ARRIVED_AT_DESTINATION) => true,
                (OrderStatus.ARRIVED_AT_DESTINATION, OrderStatus.COMPLETED) => true,
                (var status, OrderStatus.CANCELLED) when
                    status == OrderStatus.PENDING ||
                    status == OrderStatus.CONFIRMED ||
                    status == OrderStatus.DRIVER_ASSIGNED
                    => true,
                _ => false
            };

            if (!isValidTransition)
            {
                return BadRequest(ApiResponse<string>.ErrorResponse($"تغییر وضعیت از {currentStatus} به {newStatus} مجاز نیست."));
            }

            order.Status = newStatus;

            switch (newStatus)
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
                case OrderStatus.CANCELLED:
                    break;
            }

            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            if (order.CustomerId.HasValue)
            {
                await _notificationService.SendNotificationAsync(
                    order.CustomerId.Value,
                    "INFO",
                    "وضعیت سفارش شما تغییر کرد",
                    $"وضعیت سفارش شما به '{newStatus}' تغییر یافت.",
                    new { orderId = order.Id, status = newStatus }
                );
            }

            return Ok(ApiResponse<string>.SuccessResponse(null, "وضعیت سفارش با موفقیت به‌روزرسانی شد."));
        }
    }
}
