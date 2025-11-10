using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using BarbariBahar.API.Data;
using BarbariBahar.API.DTOs.Auth;
using BarbariBahar.API.Enums;
using BarbariBahar.API.Helpers;
using BarbariBahar.API.Models;
using BarbariBahar.API.Services.Interfaces;

namespace BarbariBahar.API.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IOtpService _otpService;
        private readonly JwtHelper _jwtHelper;

        public AuthService(AppDbContext context, IOtpService otpService, JwtHelper jwtHelper)
        {
            _context = context;
            _otpService = otpService;
            _jwtHelper = jwtHelper;
        }

        public async Task<string> SendOtpAsync(string phoneNumber)
        {
            var otp = await _otpService.GenerateOtpAsync(phoneNumber);
            await _otpService.SendOtpAsync(phoneNumber, otp);

            return "کد تایید با موفقیت ارسال شد";
        }

        public async Task<LoginResponseDto> LoginAsync(string phoneNumber, string otp)
        {
            // اعتبارسنجی OTP
            var isValid = await _otpService.ValidateOtpAsync(phoneNumber, otp);
            if (!isValid)
            {
                throw new UnauthorizedAccessException("کد تایید نامعتبر یا منقضی شده است");
            }

            // پیدا کردن یا ایجاد کاربر
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.PhoneNumber == phoneNumber);

            if (user == null)
            {
                // ایجاد کاربر جدید
                user = new User
                {
                    PhoneNumber = phoneNumber,
                    Role = UserRole.CUSTOMER,
                    CreatedAt = DateTime.UtcNow
                };

                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();
            }
            else
            {
                // آپدیت زمان آخرین ورود
                user.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }

            // تولید JWT Token
            var token = _jwtHelper.GenerateToken(user);

            return new LoginResponseDto
            {
                Token = token,
                UserId = user.Id.ToString(),
                PhoneNumber = user.PhoneNumber,
                FullName = user.FullName,
                Role = user.Role
            };
        }
    }
}