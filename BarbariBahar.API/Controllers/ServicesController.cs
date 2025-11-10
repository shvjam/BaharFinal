using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BarbariBahar.API.Data;
using BarbariBahar.API.DTOs.Common;
using BarbariBahar.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ServicesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<ServiceCategory>>>> GetActiveServices()
        {
            var services = await _context.ServiceCategories
                .Where(sc => sc.IsActive)
                .OrderBy(sc => sc.Order)
                .ToListAsync();

            return Ok(ApiResponse<List<ServiceCategory>>.SuccessResponse(services));
        }
    }
}