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
    public class PricingConfigsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PricingConfigsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<PricingConfig>>> CreatePricingConfig([FromBody] PricingConfigDto dto)
        {
            var pricingConfig = new PricingConfig
            {
                Name = dto.Name,
                BaseWorkerRate = dto.BaseWorkerRate,
                BaseVehicleRatesJson = dto.BaseVehicleRatesJson,
                PerKmRate = dto.PerKmRate,
                PerFloorRate = dto.PerFloorRate,
                WalkingDistanceRatesJson = dto.WalkingDistanceRatesJson,
                StopRate = dto.StopRate,
                PackingHourlyRate = dto.PackingHourlyRate,
                CancellationFee = dto.CancellationFee,
                ExpertVisitFee = dto.ExpertVisitFee,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            if (pricingConfig.IsActive)
            {
                var allOtherConfigs = await _context.PricingConfigs.Where(p => p.IsActive).ToListAsync();
                foreach (var config in allOtherConfigs)
                {
                    config.IsActive = false;
                }
            }

            await _context.PricingConfigs.AddAsync(pricingConfig);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<PricingConfig>.SuccessResponse(pricingConfig, "تعرفه قیمت‌گذاری با موفقیت ایجاد شد."));
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<PricingConfig>>>> GetAllPricingConfigs()
        {
            var configs = await _context.PricingConfigs.OrderByDescending(p => p.CreatedAt).ToListAsync();
            return Ok(ApiResponse<List<PricingConfig>>.SuccessResponse(configs));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<PricingConfig>>> GetPricingConfigById(Guid id)
        {
            var config = await _context.PricingConfigs.FindAsync(id);
            if (config == null)
            {
                return NotFound(ApiResponse<PricingConfig>.ErrorResponse("تعرفه یافت نشد."));
            }
            return Ok(ApiResponse<PricingConfig>.SuccessResponse(config));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<PricingConfig>>> UpdatePricingConfig(Guid id, [FromBody] PricingConfigDto dto)
        {
            var config = await _context.PricingConfigs.FindAsync(id);
            if (config == null)
            {
                return NotFound(ApiResponse<PricingConfig>.ErrorResponse("تعرفه یافت نشد."));
            }

            config.Name = dto.Name;
            config.BaseWorkerRate = dto.BaseWorkerRate;
            config.BaseVehicleRatesJson = dto.BaseVehicleRatesJson;
            config.PerKmRate = dto.PerKmRate;
            config.PerFloorRate = dto.PerFloorRate;
            config.WalkingDistanceRatesJson = dto.WalkingDistanceRatesJson;
            config.StopRate = dto.StopRate;
            config.PackingHourlyRate = dto.PackingHourlyRate;
            config.CancellationFee = dto.CancellationFee;
            config.ExpertVisitFee = dto.ExpertVisitFee;
            config.IsActive = dto.IsActive;

            if (config.IsActive)
            {
                var allOtherConfigs = await _context.PricingConfigs.Where(p => p.Id != id && p.IsActive).ToListAsync();
                foreach (var otherConfig in allOtherConfigs)
                {
                    otherConfig.IsActive = false;
                }
            }

            _context.PricingConfigs.Update(config);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<PricingConfig>.SuccessResponse(config, "تعرفه با موفقیت به‌روزرسانی شد."));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<string>>> DeletePricingConfig(Guid id)
        {
            var config = await _context.PricingConfigs.FindAsync(id);
            if (config == null)
            {
                return NotFound(ApiResponse<string>.ErrorResponse("تعرفه یافت نشد."));
            }

            if (config.IsActive)
            {
                 return BadRequest(ApiResponse<string>.ErrorResponse("نمی‌توان تعرفه فعال را حذف کرد. ابتدا آن را غیرفعال کنید یا تعرفه دیگری را فعال کنید."));
            }

            _context.PricingConfigs.Remove(config);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<string>.SuccessResponse(null, "تعرفه با موفقیت حذف شد."));
        }
    }
}
