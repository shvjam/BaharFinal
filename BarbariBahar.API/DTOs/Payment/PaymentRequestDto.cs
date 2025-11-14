using System;
using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.DTOs.Payment
{
    public class PaymentRequestDto
    {
        [Required]
        public Guid OrderId { get; set; }
    }
}
