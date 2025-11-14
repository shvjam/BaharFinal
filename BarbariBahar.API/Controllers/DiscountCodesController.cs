using System;
using System.Collections.Generic;
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
    public class DiscountCodesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DiscountCodesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<DiscountCode>>> CreateDiscountCode([FromBody] CreateDiscountCodeDto dto)
        {
            var codeExists = await _context.DiscountCodes.AnyAsync(dc => dc.Code == dto.Code);
            if (codeExists)
            {
                return BadRequest(ApiResponse<DiscountCode>.ErrorResponse("کد تخفیف با این نام قبلاً ثبت شده است."));
            }

            var discountCode = new DiscountCode
            {
                Code = dto.Code.ToUpper(),
                Type = dto.Type,
                Value = dto.Value,
                MaxDiscount = dto.MaxDiscount,
                MinOrderAmount = dto.MinOrderAmount,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                UsageLimit = dto.UsageLimit,
                PerUserLimit = dto.PerUserLimit,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            await _context.DiscountCodes.AddAsync(discountCode);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<DiscountCode>.SuccessResponse(discountCode, "کد تخفیف با موفقیت ایجاد شد."));
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<DiscountCode>>>> GetAllDiscountCodes()
        {
            var codes = await _context.DiscountCodes.OrderByDescending(dc => dc.CreatedAt).ToListAsync();
            return Ok(ApiResponse<List<DiscountCode>>.SuccessResponse(codes));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<DiscountCode>>> GetDiscountCodeById(Guid id)
        {
            var code = await _context.DiscountCodes.FindAsync(id);
            if (code == null)
            {
                return NotFound(ApiResponse<DiscountCode>.ErrorResponse("کد تخفیف یافت نشد."));
            }
            return Ok(ApiResponse<DiscountCode>.SuccessResponse(code));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<DiscountCode>>> UpdateDiscountCode(Guid id, [FromBody] UpdateDiscountCodeDto dto)
        {
            var code = await _context.DiscountCodes.FindAsync(id);
            if (code == null)
            {
                return NotFound(ApiResponse<DiscountCode>.ErrorResponse("کد تخفیف یافت نشد."));
            }

            code.Type = dto.Type;
            code.Value = dto.Value;
            code.MaxDiscount = dto.MaxDiscount;
            code.MinOrderAmount = dto.MinOrderAmount;
            code.StartDate = dto.StartDate;
            code.EndDate = dto.EndDate;
            code.UsageLimit = dto.UsageLimit;
            code.PerUserLimit = dto.PerUserLimit;
            code.IsActive = dto.IsActive;

            _context.DiscountCodes.Update(code);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<DiscountCode>.SuccessResponse(code, "کد تخفیف با موفقیت به‌روزرسانی شد."));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<string>>> DeleteDiscountCode(Guid id)
        {
            var code = await _context.DiscountCodes.FindAsync(id);
            if (code == null)
            {
                return NotFound(ApiResponse<string>.ErrorResponse("کد تخفیف یافت نشد."));
            }

            _context.DiscountCodes.Remove(code);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<string>.SuccessResponse(null, "کد تخفیف با موفقیت حذف شد."));
        }
    }
}
