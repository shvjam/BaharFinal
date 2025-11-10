using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using BarbariBahar.API.Services.Interfaces;

namespace BarbariBahar.API.Services.Implementations
{
    public class FileService : IFileService
    {
        private readonly string _uploadPath;

        public FileService()
        {
            _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");

            // ایجاد پوشه اگر وجود ندارد
            if (!Directory.Exists(_uploadPath))
                Directory.CreateDirectory(_uploadPath);
        }

        public async Task<string> UploadFileAsync(IFormFile file, string folder)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("فایل معتبر نیست");

            // ایجاد پوشه
            var folderPath = Path.Combine(_uploadPath, folder);
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            // تولید نام یونیک
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(folderPath, fileName);

            // ذخیره فایل
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // برگرداندن مسیر نسبی
            return $"/uploads/{folder}/{fileName}";
        }

        public async Task<bool> DeleteFileAsync(string filePath)
        {
            try
            {
                if (string.IsNullOrEmpty(filePath))
                    return false;

                var fullPath = Path.Combine(Directory.GetCurrentDirectory(), filePath.TrimStart('/'));

                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                    return await Task.FromResult(true);
                }

                return false;
            }
            catch
            {
                return false;
            }
        }
    }
}