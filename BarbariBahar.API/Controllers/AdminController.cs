using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BarbariBahar.API.Data;
using BarbariBahar.API.DTOs.Admin;
using BarbariBahar.API.DTOs.Common;
using BarbariBahar.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "ADMIN")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/admin/users
        [HttpGet("users")]
        public async Task<ActionResult<ApiResponse<List<User>>>> GetAllUsers()
        {
            var users = await _context.Users.OrderByDescending(u => u.CreatedAt).ToListAsync();
            return Ok(ApiResponse<List<User>>.SuccessResponse(users));
        }

        // GET: api/admin/drivers
        [HttpGet("drivers")]
        public async Task<ActionResult<ApiResponse<List<DriverDetailsDto>>>> GetAllDrivers()
        {
            var drivers = await _context.Drivers
                .Include(d => d.User)
                .OrderByDescending(d => d.User.CreatedAt)
                .Select(d => DriverDetailsDto.FromDriver(d))
                .ToListAsync();

            return Ok(ApiResponse<List<DriverDetailsDto>>.SuccessResponse(drivers));
        }

        // POST: api/admin/drivers/{id}/verify
        [HttpPost("drivers/{id}/verify")]
        public async Task<ActionResult<ApiResponse<string>>> VerifyDriver(Guid id)
        {
            var driver = await _context.Drivers.FindAsync(id);
            if (driver == null)
            {
                return NotFound(ApiResponse<string>.ErrorResponse("راننده مورد نظر یافت نشد."));
            }

            if (driver.DocumentsVerified)
            {
                return BadRequest(ApiResponse<string>.ErrorResponse("مدارک این راننده قبلاً تأیید شده است."));
            }

            driver.DocumentsVerified = true;
            driver.VerifiedAt = DateTime.UtcNow;
            driver.IsActive = true; // Automatically activate the driver upon verification

            _context.Drivers.Update(driver);
            await _context.SaveChangesAsync();

            // TODO: Send a notification to the driver.

            return Ok(ApiResponse<string>.SuccessResponse(null, "مدارک راننده با موفقیت تأیید شد و حساب کاربری فعال گردید."));
        }
    }
}
