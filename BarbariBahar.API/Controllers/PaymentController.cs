using System.Threading.Tasks;
using BarbariBahar.API.DTOs.Common;
using BarbariBahar.API.DTOs.Payment;
using BarbariBahar.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly IConfiguration _configuration;

        public PaymentController(IPaymentService paymentService, IConfiguration configuration)
        {
            _paymentService = paymentService;
            _configuration = configuration;
        }

        [HttpPost("request")]
        public async Task<ActionResult<ApiResponse<string>>> RequestPayment([FromBody] PaymentRequestDto dto)
        {
            // The callback URL should be configured in appsettings.json for different environments
            var callbackUrl = _configuration.GetValue<string>("ZarinpalSettings:CallbackUrl")
                              ?? "https://localhost:5001/api/payment/verify";

            var paymentUrl = await _paymentService.RequestPayment(dto.OrderId, callbackUrl);

            return Ok(ApiResponse<string>.SuccessResponse(paymentUrl, "Payment URL generated successfully."));
        }

        // The verification endpoint will be added in the next step
        [HttpGet("verify")]
        public async Task<IActionResult> VerifyPayment([FromQuery] string authority, [FromQuery] string status)
        {
            var verificationResult = await _paymentService.VerifyPayment(authority, status);

            var frontendUrl = _configuration.GetValue<string>("FrontendUrl") ?? "http://localhost:5173";

            // Redirect user to the frontend with the result
            var redirectUrl = $"{frontendUrl}/payment/result?success={verificationResult.IsSuccess}&orderId={verificationResult.OrderId}&refId={verificationResult.RefId}";

            return Redirect(redirectUrl);
        }
    }
}
