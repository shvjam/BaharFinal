using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using BarbariBahar.API.Data;
using BarbariBahar.API.Hubs;
using BarbariBahar.API.Models;
using BarbariBahar.API.Services.Interfaces;

namespace BarbariBahar.API.Services.Implementations
{
    public class NotificationService : INotificationService
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;

        public NotificationService(AppDbContext context, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        public async Task SendNotificationAsync(Guid userId, string type, string title, string message, object? data = null)
        {
            // 1. ذخیره در دیتابیس
            var notification = new Notification
            {
                UserId = userId,
                Type = type,
                Title = title,
                Message = message,
                DataJson = data != null ? JsonConvert.SerializeObject(data) : null,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();

            // 2. ارسال لحظه‌ای با SignalR
            // پیام به گروه خصوصی کاربر ارسال می‌شود
            var userGroupName = $"user_{userId}";
            await _hubContext.Clients.Group(userGroupName).SendAsync("ReceiveNotification", new
            {
                notification.Id,
                notification.Type,
                notification.Title,
                notification.Message,
                notification.DataJson,
                notification.CreatedAt
            });
        }
    }
}
