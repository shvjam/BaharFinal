using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using BarbariBahar.API.Data;
using BarbariBahar.API.DTOs.Common;
using BarbariBahar.API.DTOs.Driver;
using BarbariBahar.API.Enums;
using BarbariBahar.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using BarbariBahar.API.Services.Interfaces;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "DRIVER")]
    public class DriversController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IFileService _fileService;

        public DriversController(AppDbContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }

        [HttpPatch("status")]
        public async Task<ActionResult<ApiResponse<string>>> UpdateStatus([FromBody] UpdateDriverStatusDto dto)
        {
            var driverUserId = GetCurrentUserId();
            if (driverUserId == null)
            {
                return Unauthorized(ApiResponse<string>.ErrorResponse("Driver not found."));
            }

            var driver = await _context.Drivers.FindAsync(driverUserId.Value);
            if (driver == null)
            {
                return NotFound(ApiResponse<string>.ErrorResponse("Driver profile not found."));
            }

            if (dto.IsOnline.HasValue)
            {
                driver.IsOnline = dto.IsOnline.Value;
            }

            if (dto.IsActive.HasValue)
            {
                driver.IsActive = dto.IsActive.Value;
            }

            _context.Drivers.Update(driver);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<string>.SuccessResponse(null, "وضعیت با موفقیت به‌روزرسانی شد."));
        }

        [HttpGet("available-orders")]
        public async Task<ActionResult<ApiResponse<List<Order>>>> GetAvailableOrders()
        {
            var driverUserId = GetCurrentUserId();
            var driver = await _context.Drivers.FindAsync(driverUserId.Value);
            if (driver == null || !driver.IsActive || !driver.IsOnline)
            {
                return Ok(ApiResponse<List<Order>>.SuccessResponse(new List<Order>(), "You are not active or online."));
            }

            var availableOrders = await _context.Orders
                .Where(o => o.Status == OrderStatus.CONFIRMED && o.DriverId == null)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return Ok(ApiResponse<List<Order>>.SuccessResponse(availableOrders));
        }

        [HttpPost("accept-order/{orderId}")]
        public async Task<ActionResult<ApiResponse<string>>> AcceptOrder(Guid orderId)
        {
            var driverUserId = GetCurrentUserId();
            var driver = await _context.Drivers.FindAsync(driverUserId.Value);

            var order = await _context.Orders.FindAsync(orderId);

            if (order == null)
            {
                return NotFound(ApiResponse<string>.ErrorResponse("سفارش یافت نشد."));
            }

            if (order.Status != OrderStatus.CONFIRMED || order.DriverId != null)
            {
                return BadRequest(ApiResponse<string>.ErrorResponse("این سفارش دیگر در دسترس نیست."));
            }

            order.DriverId = driver.UserId;
            order.Status = OrderStatus.DRIVER_ASSIGNED;

            var assignment = new DriverAssignment
            {
                OrderId = order.Id,
                DriverId = driver.UserId,
                Commission = driver.CommissionPercentage,
                AssignedAt = DateTime.UtcNow,
                AcceptedAt = DateTime.UtcNow
            };

            await _context.DriverAssignments.AddAsync(assignment);
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<string>.SuccessResponse(null, "سفارش با موفقیت به شما تخصیص داده شد."));
        }

        [HttpPost("upload-document")]
        public async Task<ActionResult<ApiResponse<string>>> UploadDocument([FromForm] IFormFile file, [FromForm] string documentType)
        {
            var driverUserId = GetCurrentUserId();
            if (driverUserId == null)
            {
                return Unauthorized(ApiResponse<string>.ErrorResponse("Driver not found."));
            }

            var driver = await _context.Drivers.FindAsync(driverUserId.Value);
            if (driver == null)
            {
                return NotFound(ApiResponse<string>.ErrorResponse("Driver profile not found."));
            }

            if (file == null || file.Length == 0)
            {
                return BadRequest(ApiResponse<string>.ErrorResponse("فایل معتبر نیست."));
            }

            var filePath = await _fileService.UploadFileAsync(file, "Documents");

            switch (documentType.ToLower())
            {
                case "driverlicense":
                    driver.DriverLicenseImage = filePath;
                    break;
                case "vehiclecard":
                    driver.VehicleCardImage = filePath;
                    break;
                case "insurance":
                    driver.InsuranceImage = filePath;
                    break;
                case "profile":
                    driver.ProfileImage = filePath;
                    break;
                default:
                    return BadRequest(ApiResponse<string>.ErrorResponse("نوع مدرک نامعتبر است."));
            }

            _context.Drivers.Update(driver);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<string>.SuccessResponse(filePath, "فایل با موفقیت آپلود شد."));
        }

        private Guid? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (Guid.TryParse(userIdClaim, out var userId))
            {
                return userId;
            }
            return null;
        }
    }
}
