using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BarbariBahar.API.Data;
using BarbariBahar.API.DTOs.Common;
using BarbariBahar.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CatalogController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CatalogController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("categories")]
        public async Task<ActionResult<ApiResponse<List<CatalogCategory>>>> GetCategories()
        {
            var categories = await _context.CatalogCategories
                .OrderBy(c => c.Order)
                .ToListAsync();

            return Ok(ApiResponse<List<CatalogCategory>>.SuccessResponse(categories));
        }

        [HttpGet("categories/{categoryId}/items")]
        public async Task<ActionResult<ApiResponse<List<CatalogItem>>>> GetItemsByCategory(Guid categoryId)
        {
            var items = await _context.CatalogItems
                .Where(ci => ci.CategoryId == categoryId && ci.IsActive)
                .OrderBy(ci => ci.Order)
                .ToListAsync();

            return Ok(ApiResponse<List<CatalogItem>>.SuccessResponse(items));
        }
    }
}