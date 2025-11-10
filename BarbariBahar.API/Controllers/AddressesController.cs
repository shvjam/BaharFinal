using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using BarbariBahar.API.Data;
using BarbariBahar.API.DTOs.Common;
using BarbariBahar.API.DTOs.User;
using BarbariBahar.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // All actions in this controller require authentication
    public class AddressesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AddressesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/addresses/my-addresses
        [HttpGet("my-addresses")]
        public async Task<ActionResult<ApiResponse<List<Address>>>> GetMyAddresses()
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(ApiResponse<List<Address>>.ErrorResponse("User not found."));
            }

            var addresses = await _context.Addresses
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();

            return Ok(ApiResponse<List<Address>>.SuccessResponse(addresses));
        }

        // POST: api/addresses
        [HttpPost]
        public async Task<ActionResult<ApiResponse<Address>>> CreateAddress([FromBody] CreateAddressDto dto)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(ApiResponse<Address>.ErrorResponse("User not found."));
            }

            var address = new Address
            {
                UserId = userId.Value,
                Title = dto.Title,
                FullAddress = dto.FullAddress,
                Lat = dto.Lat,
                Lng = dto.Lng,
                District = dto.District,
                City = dto.City,
                Province = dto.Province,
                PostalCode = dto.PostalCode,
                Details = dto.Details
            };

            await _context.Addresses.AddAsync(address);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMyAddresses), new { }, ApiResponse<Address>.SuccessResponse(address, "آدرس با موفقیت ایجاد شد."));
        }

        // PUT: api/addresses/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<Address>>> UpdateAddress(Guid id, [FromBody] UpdateAddressDto dto)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(ApiResponse<Address>.ErrorResponse("User not found."));
            }

            var address = await _context.Addresses.FindAsync(id);

            if (address == null)
            {
                return NotFound(ApiResponse<Address>.ErrorResponse("آدرس مورد نظر یافت نشد."));
            }

            // Ensure the user is updating their own address
            if (address.UserId != userId)
            {
                return Forbid();
            }

            // Update only the provided fields
            if (dto.Title != null) address.Title = dto.Title;
            if (dto.FullAddress != null) address.FullAddress = dto.FullAddress;
            if (dto.Lat.HasValue) address.Lat = dto.Lat.Value;
            if (dto.Lng.HasValue) address.Lng = dto.Lng.Value;
            if (dto.District != null) address.District = dto.District;
            if (dto.City != null) address.City = dto.City;
            if (dto.Province != null) address.Province = dto.Province;
            if (dto.PostalCode != null) address.PostalCode = dto.PostalCode;
            if (dto.Details != null) address.Details = dto.Details;

            _context.Addresses.Update(address);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<Address>.SuccessResponse(address, "آدرس با موفقیت به‌روزرسانی شد."));
        }

        // DELETE: api/addresses/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<string>>> DeleteAddress(Guid id)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(ApiResponse<string>.ErrorResponse("User not found."));
            }

            var address = await _context.Addresses.FindAsync(id);

            if (address == null)
            {
                return NotFound(ApiResponse<string>.ErrorResponse("آدرس مورد نظر یافت نشد."));
            }

            // Ensure the user is deleting their own address
            if (address.UserId != userId)
            {
                return Forbid();
            }

            _context.Addresses.Remove(address);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<string>.SuccessResponse(null, "آدرس با موفقیت حذف شد."));
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
