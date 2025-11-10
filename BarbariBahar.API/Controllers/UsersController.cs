using System;
using System.Security.Claims;
using System.Threading.Tasks;
using BarbariBahar.API.Data;
using BarbariBahar.API.DTOs.Common;
using BarbariBahar.API.DTOs.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // All actions require authentication
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/users/me
        [HttpGet("me")]
        public async Task<ActionResult<ApiResponse<UserProfileDto>>> GetMyProfile()
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(ApiResponse<UserProfileDto>.ErrorResponse("User not found."));
            }

            var user = await _context.Users.FindAsync(userId.Value);
            if (user == null)
            {
                return NotFound(ApiResponse<UserProfileDto>.ErrorResponse("User profile not found."));
            }

            var userProfileDto = new UserProfileDto
            {
                Id = user.Id,
                PhoneNumber = user.PhoneNumber,
                FullName = user.FullName,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };

            return Ok(ApiResponse<UserProfileDto>.SuccessResponse(userProfileDto));
        }

        // PUT: api/users/me
        [HttpPut("me")]
        public async Task<ActionResult<ApiResponse<UserProfileDto>>> UpdateMyProfile([FromBody] UpdateProfileDto dto)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(ApiResponse<UserProfileDto>.ErrorResponse("User not found."));
            }

            var user = await _context.Users.FindAsync(userId.Value);
            if (user == null)
            {
                return NotFound(ApiResponse<UserProfileDto>.ErrorResponse("User profile not found."));
            }

            if (dto.FullName != null)
            {
                user.FullName = dto.FullName;
                user.UpdatedAt = DateTime.UtcNow;
                _context.Users.Update(user);
                await _context.SaveChangesAsync();
            }

            var updatedUserProfileDto = new UserProfileDto
            {
                Id = user.Id,
                PhoneNumber = user.PhoneNumber,
                FullName = user.FullName,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };

            return Ok(ApiResponse<UserProfileDto>.SuccessResponse(updatedUserProfileDto, "پروفایل با موفقیت به‌روزرسانی شد."));
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
