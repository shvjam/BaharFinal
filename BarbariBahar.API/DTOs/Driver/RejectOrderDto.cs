using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.DTOs.Driver
{
    public class RejectOrderDto
    {
        [Required(ErrorMessage = "دلیل رد سفارش الزامی است.")]
        [MaxLength(500, ErrorMessage = "دلیل رد سفارش نمی‌تواند بیشتر از 500 کاراکتر باشد.")]
        public string Reason { get; set; }
    }
}
