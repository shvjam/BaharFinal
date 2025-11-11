using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace BarbariBahar.API.Hubs
{
    [Authorize]
    public class NotificationHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!string.IsNullOrEmpty(userId))
            {
                // هر کاربر به یک گروه با نام منحصر به فرد خودش می‌پیوندد
                // این کار ارسال پیام خصوصی به کاربر را ممکن می‌سازد
                var userGroupName = $"user_{userId}";
                await Groups.AddToGroupAsync(Context.ConnectionId, userGroupName);
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!string.IsNullOrEmpty(userId))
            {
                var userGroupName = $"user_{userId}";
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, userGroupName);
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}
