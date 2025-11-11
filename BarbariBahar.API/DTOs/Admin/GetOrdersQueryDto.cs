using BarbariBahar.API.Enums;
using Microsoft.AspNetCore.Mvc;

namespace BarbariBahar.API.DTOs.Admin
{
    public class GetOrdersQueryDto
    {
        [FromQuery(Name = "page")]
        public int Page { get; set; } = 1;

        [FromQuery(Name = "pageSize")]
        public int PageSize { get; set; } = 10;

        [FromQuery(Name = "status")]
        public OrderStatus? Status { get; set; }

        [FromQuery(Name = "phone")]
        public string? CustomerPhone { get; set; }
    }
}
