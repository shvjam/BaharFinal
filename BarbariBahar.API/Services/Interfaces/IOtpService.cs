using System.Threading.Tasks;

namespace BarbariBahar.API.Services.Interfaces
{
    public interface IOtpService
    {
        Task<string> GenerateOtpAsync(string phoneNumber);
        Task<bool> ValidateOtpAsync(string phoneNumber, string otp);
        Task SendOtpAsync(string phoneNumber, string otp);
    }
}