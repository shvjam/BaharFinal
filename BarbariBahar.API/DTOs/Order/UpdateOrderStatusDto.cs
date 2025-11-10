using BarbariBahar.API.Enums;
using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.DTOs.Order
{
    public class UpdateOrderStatusDto
    {
        [Required]
        public OrderStatus Status { get; set; }
    }
}
