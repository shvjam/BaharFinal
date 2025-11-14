using System;
using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.DTOs.Admin
{
    public class AssignDriverDto
    {
        [Required]
        public Guid DriverId { get; set; }

        [MaxLength(500)]
        public string? Note { get; set; }
    }
}
