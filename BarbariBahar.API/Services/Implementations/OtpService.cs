using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using BarbariBahar.API.Services.Interfaces;
using Microsoft.Extensions.Configuration;

namespace BarbariBahar.API.Services.Implementations
{
    public class OtpService : IOtpService
    {
        // For a real-world scenario, use a distributed cache like Redis.
        private static readonly Dictionary<string, (string otp, DateTime expiry)> _otpStorage = new();
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public OtpService(IConfiguration configuration, HttpClient httpClient)
        {
            _configuration = configuration;
            _httpClient = httpClient;
        }

        public Task<string> GenerateOtpAsync(string phoneNumber)
        {
            // Generate a 4-digit random code
            var random = new Random();
            var otp = random.Next(1000, 9999).ToString();

            // Store it with a 2-minute expiration
            _otpStorage[phoneNumber] = (otp, DateTime.UtcNow.AddMinutes(2));

            return Task.FromResult(otp);
        }

        public Task<bool> ValidateOtpAsync(string phoneNumber, string otp)
        {
            if (!_otpStorage.ContainsKey(phoneNumber))
                return Task.FromResult(false);

            var (storedOtp, expiry) = _otpStorage[phoneNumber];

            // Check for expiration
            if (DateTime.UtcNow > expiry)
            {
                _otpStorage.Remove(phoneNumber);
                return Task.FromResult(false);
            }

            // Check if the code is correct
            if (storedOtp != otp)
                return Task.FromResult(false);

            // Remove the used OTP
            _otpStorage.Remove(phoneNumber);

            return Task.FromResult(true);
        }

        public async Task SendOtpAsync(string phoneNumber, string otp)
        {
            // This part is commented out until the actual ApiKey and PatternCode are provided.
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
                // In a real-world scenario, log the error.
                Console.WriteLine($"[OTP] Failed to send OTP to {phoneNumber}. Status: {response.StatusCode}");
                throw new Exception("Failed to send OTP message.");
            }
            */

            // For testing purposes, we just log the OTP to the console.
            Console.WriteLine($"[OTP] Sending OTP {otp} to {phoneNumber}");

            await Task.CompletedTask;
        }
    }
}