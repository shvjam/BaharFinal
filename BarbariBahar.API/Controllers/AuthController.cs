using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using BarbariBahar.API.DTOs.Auth;
using BarbariBahar.API.DTOs.Common;
using BarbariBahar.API.Services.Interfaces;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("send-otp")]
        public async Task<ActionResult<ApiResponse<string>>> SendOtp([FromBody] SendOtpRequestDto request)
        {
            try
            {
                var message = await _authService.SendOtpAsync(request.PhoneNumber);
                return Ok(ApiResponse<string>.SuccessResponse(message));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<string>.ErrorResponse(ex.Message));
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse<LoginResponseDto>>> Login([FromBody] LoginRequestDto request)
        {
            try
            {
                var response = await _authService.LoginAsync(request.PhoneNumber, request.Otp);
                return Ok(ApiResponse<LoginResponseDto>.SuccessResponse(response));
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ApiResponse<LoginResponseDto>.ErrorResponse(ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<LoginResponseDto>.ErrorResponse(ex.Message));
            }
        }
    }
}