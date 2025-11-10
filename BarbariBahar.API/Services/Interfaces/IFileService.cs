using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace BarbariBahar.API.Services.Interfaces
{
    public interface IFileService
    {
        Task<string> UploadFileAsync(IFormFile file, string folder);
        Task<bool> DeleteFileAsync(string filePath);
    }
}