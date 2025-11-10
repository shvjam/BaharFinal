using System.Linq;
using System.Threading.Tasks;
using BarbariBahar.API.Data;
using BarbariBahar.API.DTOs.Common;
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
        public async Task<ActionResult<ApiResponse<object>>> GetDashboardStats()
        {
            var totalOrders = await _context.Orders.CountAsync();
            var totalRevenue = await _context.Orders.Where(o => o.FinalPrice.HasValue).SumAsync(o => o.FinalPrice.Value);
            var totalCustomers = await _context.Users.CountAsync(u => u.Role == Enums.UserRole.CUSTOMER);
            var activeDrivers = await _context.Drivers.CountAsync(d => d.IsActive && d.IsOnline);

            var stats = new
            {
                TotalOrders = totalOrders,
                TotalRevenue = totalRevenue,
                TotalCustomers = totalCustomers,
                ActiveDrivers = activeDrivers
            };

            return Ok(ApiResponse<object>.SuccessResponse(stats));
        }
    }
}
