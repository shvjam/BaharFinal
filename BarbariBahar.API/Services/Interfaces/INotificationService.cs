using System;
using System.Threading.Tasks;

namespace BarbariBahar.API.Services.Interfaces
{
    public interface INotificationService
    {
        Task SendNotificationAsync(Guid userId, string type, string title, string message, object? data = null);
    }
}
