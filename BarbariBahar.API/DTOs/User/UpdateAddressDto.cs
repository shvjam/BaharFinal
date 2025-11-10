using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.DTOs.User
{
    public class UpdateAddressDto
    {
        [MaxLength(50)]
        public string? Title { get; set; }

        [MaxLength(500)]
        public string? FullAddress { get; set; }

        public double? Lat { get; set; }

        public double? Lng { get; set; }

        [MaxLength(50)]
        public string? District { get; set; }

        [MaxLength(50)]
        public string? City { get; set; }

        [MaxLength(50)]
        public string? Province { get; set; }

        [MaxLength(10)]
        public string? PostalCode { get; set; }

        [MaxLength(500)]
        public string? Details { get; set; }
    }
}
