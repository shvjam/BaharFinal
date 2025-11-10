using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarbariBahar.API.Models
{
    public class LocationDetails
    {
        [Key]
        [ForeignKey("Order")]
        public Guid OrderId { get; set; }

        public int OriginFloor { get; set; } = 0;
        public bool OriginHasElevator { get; set; } = false;

        public int DestinationFloor { get; set; } = 0;
        public bool DestinationHasElevator { get; set; } = false;

        public int WalkDistanceMeters { get; set; } = 0;
        public int StopCount { get; set; } = 0;

        // Navigation Property
        public virtual Order Order { get; set; } = null!;
    }
}