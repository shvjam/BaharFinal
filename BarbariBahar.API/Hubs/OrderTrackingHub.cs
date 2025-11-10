using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using BarbariBahar.API.Data;
using BarbariBahar.API.Models;

namespace BarbariBahar.API.Hubs
{
    public class OrderTrackingHub : Hub
    {
        private readonly AppDbContext _context;

        public OrderTrackingHub(AppDbContext context)
        {
            _context = context;
        }

        // راننده به گروه سفارش می‌پیوندد
        public async Task JoinOrderGroup(string orderId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"order-{orderId}");
        }

        // راننده موقعیت خود را آپدیت می‌کند
        public async Task UpdateDriverLocation(string orderId, string driverId, double lat, double lng, double? heading, double? speed)
        {
            try
            {
                var driverGuid = Guid.Parse(driverId);
                var orderGuid = Guid.Parse(orderId);

                // ذخیره در دیتابیس
                var locationUpdate = new LocationUpdate
                {
                    DriverId = driverGuid,
                    OrderId = orderGuid,
                    Lat = lat,
                    Lng = lng,
                    Heading = heading,
                    Speed = speed,
                    Timestamp = DateTime.UtcNow
                };

                await _context.LocationUpdates.AddAsync(locationUpdate);

                // آپدیت موقعیت فعلی راننده
                var driver = await _context.Drivers.FindAsync(driverGuid);
                if (driver != null)
                {
                    driver.CurrentLat = lat;
                    driver.CurrentLng = lng;
                    driver.LastLocationUpdate = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();

                // ارسال به تمام کلاینت‌های در گروه سفارش
                await Clients.Group($"order-{orderId}").SendAsync("ReceiveLocationUpdate", new
                {
                    driverId,
                    orderId,
                    lat,
                    lng,
                    heading,
                    speed,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating location: {ex.Message}");
            }
        }

        // آپدیت وضعیت سفارش
        public async Task UpdateOrderStatus(string orderId, string status)
        {
            await Clients.Group($"order-{orderId}").SendAsync("OrderStatusUpdated", new
            {
                orderId,
                status,
                timestamp = DateTime.UtcNow
            });
        }
    }
}