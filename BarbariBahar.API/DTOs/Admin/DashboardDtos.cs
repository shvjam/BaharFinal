namespace BarbariBahar.API.DTOs.Admin
{
    public class DashboardStatsDto
    {
        public int TotalOrders { get; set; }
        public int ActiveOrders { get; set; }
        public int CompletedOrders { get; set; }
        public decimal TotalRevenue { get; set; }
        public int PendingPayments { get; set; }
        public int ActiveDrivers { get; set; }
        public int TotalCustomers { get; set; }
        public double AvgRating { get; set; }
    }

    public class DriverStatsDto
    {
        public int TotalRides { get; set; }
        public int CompletedRides { get; set; }
        public decimal TotalEarnings { get; set; }
        public double AvgRating { get; set; }
        public int ActiveOrders { get; set; }
    }

    public class CustomerStatsDto
    {
        public int TotalOrders { get; set; }
        public int CompletedOrders { get; set; }
        public decimal TotalSpent { get; set; }
        public int SavedAddresses { get; set; }
    }
}
