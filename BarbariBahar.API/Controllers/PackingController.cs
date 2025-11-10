using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BarbariBahar.API.Data;
using BarbariBahar.API.DTOs.Common;
using BarbariBahar.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Accessible to logged-in users
    public class PackingController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PackingController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("products")]
        public async Task<ActionResult<ApiResponse<List<PackingProduct>>>> GetPackingProducts()
        {
            var products = await _context.PackingProducts
                .Where(p => p.IsActive)
                .OrderBy(p => p.Name)
                .ToListAsync();

            return Ok(ApiResponse<List<PackingProduct>>.SuccessResponse(products));
        }
    }
}
