using System.Threading.Tasks;
using BarbariBahar.API.DTOs.Auth;

namespace BarbariBahar.API.Services.Interfaces
{
    public interface IAuthService
    {
        Task<string> SendOtpAsync(string phoneNumber);
        Task<LoginResponseDto> LoginAsync(string phoneNumber, string otp);
    }
}