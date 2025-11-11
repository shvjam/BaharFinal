using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using BarbariBahar.API.Configurations;
using BarbariBahar.API.Services.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace BarbariBahar.API.Services.Implementations
{
    public class OtpService : IOtpService
    {
        private readonly HttpClient _httpClient;
        private readonly IMemoryCache _cache;
        private readonly FarazSmsSettings _smsSettings;

        public OtpService(IHttpClientFactory httpClientFactory, IMemoryCache cache, IOptions<FarazSmsSettings> smsSettings)
        {
            _httpClient = httpClientFactory.CreateClient("FarazSms");
            _cache = cache;
            _smsSettings = smsSettings.Value;
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
            // Check if API key is a placeholder
            if (string.IsNullOrEmpty(_smsSettings.ApiKey) || _smsSettings.ApiKey.StartsWith("YOUR_"))
            {
                Console.WriteLine($"[OTP-SIMULATION] SMS service is not configured. Sending OTP {otp} to {phoneNumber}");
                return; // Do not proceed with the actual API call
            }

            var requestBody = new
            {
                pattern_code = _smsSettings.PatternCode,
                originator = _smsSettings.Originator,
                recipient = phoneNumber,
                values = new { code = otp }
            };

            var request = new HttpRequestMessage(HttpMethod.Post, "https://api.ippanel.com/v1/messages/patterns/send");
            request.Content = JsonContent.Create(requestBody);

            // The API key is added via a delegating handler configured in Program.cs

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"[OTP] Failed to send OTP to {phoneNumber}. Status: {response.StatusCode}, Response: {errorContent}");
                throw new Exception("Failed to send OTP message.");
            }

            Console.WriteLine($"[OTP] Successfully sent OTP {otp} to {phoneNumber}");
        }
    }
}
