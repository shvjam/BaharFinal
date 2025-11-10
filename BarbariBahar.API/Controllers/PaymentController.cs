using System;
using System.Security.Claims;
using System.Threading.Tasks;
using BarbariBahar.API.Data;
using BarbariBahar.API.DTOs.Common;
using BarbariBahar.API.Enums;
using BarbariBahar.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PaymentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PaymentController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/payment/{orderId}
        [HttpPost("{orderId}")]
        public async Task<ActionResult<ApiResponse<Payment>>> CreatePayment(Guid orderId)
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == orderId && o.CustomerId == userId);

            if (order == null)
            {
                return NotFound(ApiResponse<Payment>.ErrorResponse("سفارش یافت نشد یا متعلق به شما نیست."));
            }

            if (order.Payment != null)
            {
                return BadRequest(ApiResponse<Payment>.ErrorResponse("برای این سفارش قبلاً پرداخت ایجاد شده است."));
            }

            var amount = order.FinalPrice ?? order.EstimatedPrice;

            var payment = new Payment
            {
                OrderId = order.Id,
                Amount = amount,
                Status = PaymentStatus.PENDING,
                Method = PaymentMethod.ONLINE // Defaulting to online
            };

            await _context.Payments.AddAsync(payment);
            await _context.SaveChangesAsync();

            // TODO: Redirect user to a payment gateway

            return Ok(ApiResponse<Payment>.SuccessResponse(payment, "رکورد پرداخت با موفقیت ایجاد شد."));
        }
    }
}
