using System.Linq;
using System.Threading.Tasks;
using BarbariBahar.API.Data;
using BarbariBahar.API.DTOs.Common;
using BarbariBahar.API.DTOs.Admin;
using BarbariBahar.API.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "ADMIN")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<ActionResult<ApiResponse<DashboardStatsDto>>> GetDashboardStats()
        {
            var stats = new DashboardStatsDto
            {
                TotalOrders = await _context.Orders.CountAsync(),
                ActiveOrders = await _context.Orders.CountAsync(o =>
                    o.Status != OrderStatus.COMPLETED && o.Status != OrderStatus.CANCELLED),
                CompletedOrders = await _context.Orders.CountAsync(o => o.Status == OrderStatus.COMPLETED),
                TotalRevenue = await _context.Payments
                    .Where(p => p.Status == PaymentStatus.PAID)
                    .SumAsync(p => p.Amount),
                PendingPayments = await _context.Payments.CountAsync(p => p.Status == PaymentStatus.PENDING),
                ActiveDrivers = await _context.Drivers.CountAsync(d => d.IsActive && d.IsOnline),
                TotalCustomers = await _context.Users.CountAsync(u => u.Role == UserRole.CUSTOMER),
                AvgRating = await _context.Orders.Where(o => o.Rating.HasValue && o.Rating > 0).AnyAsync()
                    ? await _context.Orders.Where(o => o.Rating.HasValue && o.Rating > 0).AverageAsync(o => o.Rating.Value)
                    : 0
            };

            return Ok(ApiResponse<DashboardStatsDto>.SuccessResponse(stats));
        }
    }
}
