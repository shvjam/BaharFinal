using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using BarbariBahar.API.Configurations;
using BarbariBahar.API.Data;
using BarbariBahar.API.DTOs.Payment;
using BarbariBahar.API.Enums;
using BarbariBahar.API.Models;
using BarbariBahar.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace BarbariBahar.API.Services.Implementations
{
    public class PaymentService : IPaymentService
    {
        private readonly AppDbContext _context;
        private readonly HttpClient _httpClient;
        private readonly ZarinpalSettings _zarinpalSettings;

        public PaymentService(AppDbContext context, IHttpClientFactory httpClientFactory, IOptions<ZarinpalSettings> zarinpalSettings)
        {
            _context = context;
            _httpClient = httpClientFactory.CreateClient("Zarinpal");
            _zarinpalSettings = zarinpalSettings.Value;
        }

        public async Task<string> RequestPayment(Guid orderId, string callbackUrl)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
                throw new Exception("Order not found.");

            // Use FinalPrice if available, otherwise EstimatedPrice
            var amount = (int)(order.FinalPrice ?? order.EstimatedPrice);

            // Check if a pending payment already exists
            var existingPayment = await _context.Payments.FirstOrDefaultAsync(p => p.OrderId == orderId && p.Status == PaymentStatus.PENDING);
            if(existingPayment != null)
            {
                 _context.Payments.Remove(existingPayment);
            }

            var payment = new Payment
            {
                OrderId = orderId,
                Amount = amount,
                Status = PaymentStatus.PENDING,
                Method = PaymentMethod.ONLINE,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Payments.AddAsync(payment);

            var requestDto = new ZarinpalRequestDto
            {
                merchant_id = _zarinpalSettings.MerchantId,
                amount = amount,
                description = $"پرداخت برای سفارش شماره {order.Id}",
                callback_url = callbackUrl,
                metadata = new { mobile = order.CustomerPhone }
            };

            var response = await _httpClient.PostAsJsonAsync("request.json", requestDto);

            if (!response.IsSuccessStatusCode)
                throw new Exception("Failed to connect to payment gateway.");

            var responseData = await response.Content.ReadFromJsonAsync<ZarinpalResponseDto>();

            if (responseData == null || responseData.data.code != 100)
                throw new Exception("Failed to create payment transaction.");

            payment.GatewayTransactionId = responseData.data.authority; // Storing Authority
            await _context.SaveChangesAsync();

            var redirectUrl = _zarinpalSettings.IsSandbox
                ? $"https://sandbox.zarinpal.com/pg/StartPay/{responseData.data.authority}"
                : $"https://www.zarinpal.com/pg/StartPay/{responseData.data.authority}";

            return redirectUrl;
        }

        public async Task<VerificationResponseDto> VerifyPayment(string authority, string status)
        {
            var payment = await _context.Payments.FirstOrDefaultAsync(p => p.GatewayTransactionId == authority);

            if (payment == null)
                return new VerificationResponseDto { IsSuccess = false, Message = "تراکنش یافت نشد." };

            if (status != "OK")
            {
                payment.Status = PaymentStatus.FAILED;
                await _context.SaveChangesAsync();
                return new VerificationResponseDto { IsSuccess = false, Message = "پرداخت توسط کاربر لغو شد.", OrderId = payment.OrderId };
            }

            var verificationRequestDto = new ZarinpalVerificationRequestDto
            {
                merchant_id = _zarinpalSettings.MerchantId,
                authority = authority,
                amount = (int)payment.Amount
            };

            var response = await _httpClient.PostAsJsonAsync("verify.json", verificationRequestDto);

            if (!response.IsSuccessStatusCode)
            {
                payment.Status = PaymentStatus.FAILED;
                await _context.SaveChangesAsync();
                return new VerificationResponseDto { IsSuccess = false, Message = "خطا در برقراری ارتباط با درگاه پرداخت.", OrderId = payment.OrderId };
            }

            var responseData = await response.Content.ReadFromJsonAsync<ZarinpalVerificationResponseDto>();

            if (responseData.data.code == 100 || responseData.data.code == 101) // 100: Success, 101: Already verified
            {
                payment.Status = PaymentStatus.PAID;
                payment.PaidAt = DateTime.UtcNow;
                payment.GatewayResponseJson = JsonSerializer.Serialize(responseData.data);

                // Storing RefId in a field if it exists, for example in GatewayTransactionId
                // For now, let's assume RefId can be stored somewhere. We will add a new field later if needed.
                // payment.RefId = responseData.data.ref_id;

                await _context.SaveChangesAsync();

                return new VerificationResponseDto { IsSuccess = true, Message = "پرداخت با موفقیت انجام شد.", OrderId = payment.OrderId, RefId = responseData.data.ref_id };
            }
            else
            {
                payment.Status = PaymentStatus.FAILED;
                await _context.SaveChangesAsync();
                return new VerificationResponseDto { IsSuccess = false, Message = $"پرداخت ناموفق بود. کد خطا: {responseData.data.code}", OrderId = payment.OrderId };
            }
        }

        #region Zarinpal DTOs
        private class ZarinpalRequestDto
        {
            public string merchant_id { get; set; }
            public int amount { get; set; }
            public string description { get; set; }
            public string callback_url { get; set; }
            public object metadata { get; set; }
        }

        private class ZarinpalResponseDto
        {
            public ZarinpalData data { get; set; }
            public object[] errors { get; set; }
        }

        private class ZarinpalData
        {
            public int code { get; set; }
            public string message { get; set; }
            public string authority { get; set; }
            public string fee_type { get; set; }
            public int fee { get; set; }
        }

        private class ZarinpalVerificationRequestDto
        {
            public string merchant_id { get; set; }
            public string authority { get; set; }
            public int amount { get; set; }
        }

        private class ZarinpalVerificationResponseDto
        {
            public ZarinpalVerificationData data { get; set; }
            public object[] errors { get; set; }
        }

        private class ZarinpalVerificationData
        {
            public int code { get; set; }
            public string message { get; set; }
            public string card_hash { get; set; }
            public string card_pan { get; set; }
            public long ref_id { get; set; }
            public string fee_type { get; set; }
            public int fee { get; set; }
        }
        #endregion
    }
}
