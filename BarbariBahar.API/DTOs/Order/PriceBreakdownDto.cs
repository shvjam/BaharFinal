namespace BarbariBahar.API.DTOs.Order
{
    public class PriceBreakdownDto
    {
        public string Label { get; set; } = string.Empty;
        public int? Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public string? Description { get; set; }
    }
}