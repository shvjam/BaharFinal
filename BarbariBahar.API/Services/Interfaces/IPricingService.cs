using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BarbariBahar.API.DTOs.Order;

namespace BarbariBahar.API.Services.Interfaces
{
    public interface IPricingService
    {
        Task<(decimal finalPrice, decimal discountAmount)> CalculateOrderPriceAsync(CreateOrderDto orderDto);
        Task<List<PriceBreakdownDto>> GetPriceBreakdownAsync(CreateOrderDto orderDto);
    }
}