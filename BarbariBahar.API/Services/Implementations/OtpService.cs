using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using BarbariBahar.API.Services.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;

namespace BarbariBahar.API.Services.Implementations
{
    public class OtpService : IOtpService
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;
        private readonly IMemoryCache _cache;

        public OtpService(IConfiguration configuration, HttpClient httpClient, IMemoryCache cache)
        {
            _configuration = configuration;
            _httpClient = httpClient;
            _cache = cache;
        }

        public Task<string> GenerateOtpAsync(string phoneNumber)
        {
            var random = new Random();
            var otp = random.Next(1000, 9999).ToString();

            var cacheEntryOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromMinutes(2));

            _cache.Set(phoneNumber, otp, cacheEntryOptions);

            return Task.FromResult(otp);
        }

        public Task<bool> ValidateOtpAsync(string phoneNumber, string otp)
        {
            if (_cache.TryGetValue(phoneNumber, out string storedOtp))
            {
                if (storedOtp == otp)
                {
                    _cache.Remove(phoneNumber);
                    return Task.FromResult(true);
                }
            }

            return Task.FromResult(false);
        }

        public async Task SendOtpAsync(string phoneNumber, string otp)
        {
            // This part remains commented out as per the initial implementation.
            /*
            var apiKey = _configuration["FarazSms:ApiKey"];
            var patternCode = _configuration["FarazSms:PatternCode"];
            var originator = _configuration["FarazSms:Originator"];

            var requestBody = new
            {
                pattern_code = patternCode,
                originator = originator,
                recipient = phoneNumber,
                values = new { code = otp }
            };

            _httpClient.DefaultRequestHeaders.Add("Authorization", $"AccessKey {apiKey}");

            var response = await _httpClient.PostAsJsonAsync("https://api.ippanel.com/v1/messages/patterns/send", requestBody);

            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"[OTP] Failed to send OTP to {phoneNumber}. Status: {response.StatusCode}");
                throw new Exception("Failed to send OTP message.");
            }
            */

            Console.WriteLine($"[OTP] Sending OTP {otp} to {phoneNumber}");

            await Task.CompletedTask;
        }
    }
}
