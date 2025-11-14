namespace BarbariBahar.API.DTOs.Payment
{
    public class VerificationResponseDto
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public long? RefId { get; set; }
        public Guid OrderId { get; set; }
    }
}
