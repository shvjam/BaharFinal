using System.Threading.Tasks;
using BarbariBahar.API.DTOs.Common;
using BarbariBahar.API.DTOs.Order;
using BarbariBahar.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PricingController : ControllerBase
    {
        private readonly IPricingService _pricingService;

        public PricingController(IPricingService pricingService)
        {
            _pricingService = pricingService;
        }

        [HttpPost("calculate")]
        public async Task<ActionResult<ApiResponse<List<PriceBreakdownDto>>>> GetPriceBreakdown([FromBody] CreateOrderDto orderDto)
        {
            try
            {
                var breakdown = await _pricingService.GetPriceBreakdownAsync(orderDto);
                return Ok(ApiResponse<List<PriceBreakdownDto>>.SuccessResponse(breakdown));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<List<PriceBreakdownDto>>.ErrorResponse(ex.Message));
            }
        }
    }
}