using System;
using System.Threading.Tasks;
using BarbariBahar.API.DTOs.Payment;

namespace BarbariBahar.API.Services.Interfaces
{
    public interface IPaymentService
    {
        Task<string> RequestPayment(Guid orderId, string callbackUrl);
        Task<VerificationResponseDto> VerifyPayment(string authority, string status);
    }
}
