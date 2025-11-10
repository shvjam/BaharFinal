using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.DTOs.User
{
    public class CreateAddressDto
    {
        [Required(ErrorMessage = "عنوان آدرس الزامی است")]
        [MaxLength(50)]
        public string Title { get; set; }

        [Required(ErrorMessage = "آدرس کامل الزامی است")]
        [MaxLength(500)]
        public string FullAddress { get; set; }

        [Required(ErrorMessage = "عرض جغرافیایی الزامی است")]
        public double Lat { get; set; }

        [Required(ErrorMessage = "طول جغرافیایی الزامی است")]
        public double Lng { get; set; }

        [Required(ErrorMessage = "منطقه الزامی است")]
        [MaxLength(50)]
        public string District { get; set; }

        [Required(ErrorMessage = "شهر الزامی است")]
        [MaxLength(50)]
        public string City { get; set; }

        [Required(ErrorMessage = "استان الزامی است")]
        [MaxLength(50)]
        public string Province { get; set; }

        [MaxLength(10)]
        public string? PostalCode { get; set; }

        [MaxLength(500)]
        public string? Details { get; set; }
    }
}
