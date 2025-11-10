using Microsoft.EntityFrameworkCore;
using BarbariBahar.API.Models;
using BarbariBahar.API.Enums;

namespace BarbariBahar.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // DbSets
        public DbSet<User> Users { get; set; }
        public DbSet<Driver> Drivers { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<ServiceCategory> ServiceCategories { get; set; }
        public DbSet<CatalogCategory> CatalogCategories { get; set; }
        public DbSet<CatalogItem> CatalogItems { get; set; }
        public DbSet<PackingProduct> PackingProducts { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<PackingService> PackingServices { get; set; }
        public DbSet<LocationDetails> LocationDetails { get; set; }
        public DbSet<DriverAssignment> DriverAssignments { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<LocationUpdate> LocationUpdates { get; set; }
        public DbSet<PricingConfig> PricingConfigs { get; set; }
        public DbSet<DiscountCode> DiscountCodes { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure all enums to be stored as strings
            modelBuilder.Entity<User>().Property(u => u.Role).HasConversion<string>();
            modelBuilder.Entity<Order>().Property(o => o.Status).HasConversion<string>();
            modelBuilder.Entity<Driver>().Property(d => d.VehicleType).HasConversion<string>();
            modelBuilder.Entity<PackingService>().Property(ps => ps.Type).HasConversion<string>();
            modelBuilder.Entity<Payment>().Property(p => p.Status).HasConversion<string>();
            modelBuilder.Entity<Payment>().Property(p => p.Method).HasConversion<string>();


            if (Database.ProviderName == "Microsoft.EntityFrameworkCore.SqlServer")
            {
                // SQL Server specific configurations
                modelBuilder.Entity<Driver>().Property(d => d.TotalEarnings).HasColumnType("decimal(18,2)");
                modelBuilder.Entity<CatalogItem>().Property(ci => ci.BasePrice).HasColumnType("decimal(18,2)");
                modelBuilder.Entity<PackingProduct>().Property(pp => pp.Price).HasColumnType("decimal(18,2)");
                modelBuilder.Entity<Order>().Property(o => o.EstimatedPrice).HasColumnType("decimal(18,2)");
                modelBuilder.Entity<Order>().Property(o => o.FinalPrice).HasColumnType("decimal(18,2)");
                modelBuilder.Entity<Order>().Property(o => o.DiscountAmount).HasColumnType("decimal(18,2)");
                modelBuilder.Entity<Order>().Property(o => o.CancellationFee).HasColumnType("decimal(18,2)");
                modelBuilder.Entity<Order>().Property(o => o.DetailsJson).HasColumnType("nvarchar(max)");
                modelBuilder.Entity<Order>().Property(o => o.OriginAddressJson).HasColumnType("nvarchar(max)");
                modelBuilder.Entity<Order>().Property(o => o.DestinationAddressJson).HasColumnType("nvarchar(max)");
                modelBuilder.Entity<Order>().Property(o => o.StopsJson).HasColumnType("nvarchar(max)");
                modelBuilder.Entity<OrderItem>().Property(oi => oi.UnitPrice).HasColumnType("decimal(18,2)");
                modelBuilder.Entity<OrderItem>().Property(oi => oi.TotalPrice).HasColumnType("decimal(18,2)");
                modelBuilder.Entity<PackingService>().Property(ps => ps.PackingItemsJson).HasColumnType("nvarchar(max)");
                modelBuilder.Entity<PackingService>().Property(ps => ps.PackingProductsJson).HasColumnType("nvarchar(max)");
                modelBuilder.Entity<DriverAssignment>().Property(da => da.CommissionAmount).HasColumnType("decimal(18,2)");
                modelBuilder.Entity<Payment>().Property(p => p.Amount).HasColumnType("decimal(18,2)");
                modelBuilder.Entity<Payment>().Property(p => p.GatewayResponseJson).HasColumnType("nvarchar(max)");
                modelBuilder.Entity<PricingConfig>().Property(pc => pc.BaseWorkerRate).HasColumnType("decimal(18,2)");
                modelBuilder.Entity<PricingConfig>().Property(pc => pc.BaseVehicleRatesJson).HasColumnType("nvarchar(max)");
                modelBuilder.Entity<PricingConfig>().Property(pc => pc.PerKmRate).HasColumnType("decimal(18,2)");
                modelBuilder.Entity<PricingConfig>().Property(pc => pc.PerFloorRate).HasColumnType("decimal(18,2)");
                modelBuilder.Entity<PricingConfig>().Property(pc => pc.WalkingDistanceRatesJson).HasColumnType("nvarchar(max)");
                modelBuilder.Entity<PricingConfig>().Property(pc => pc.StopRate).HasColumnType("decimal(18,2)");
                modelBuilder.Entity<PricingConfig>().Property(pc => pc.PackingHourlyRate).HasColumnType("decimal(18,2)");
                modelBuilder.Entity<PricingConfig>().Property(pc => pc.CancellationFee).HasColumnType("decimal(18,2)");
                modelBuilder.Entity<PricingConfig>().Property(pc => pc.ExpertVisitFee).HasColumnType("decimal(18,2)");
                modelBuilder.Entity<DiscountCode>().Property(dc => dc.Value).HasColumnType("decimal(18,2)");
                modelBuilder.Entity<DiscountCode>().Property(dc => dc.MaxDiscount).HasColumnType("decimal(18,2)");
                modelBuilder.Entity<DiscountCode>().Property(dc => dc.MinOrderAmount).HasColumnType("decimal(18,2)");
                modelBuilder.Entity<Notification>().Property(n => n.DataJson).HasColumnType("nvarchar(max)");
            }

            // User - Driver (One to One)
            modelBuilder.Entity<User>()
                .HasOne(u => u.DriverProfile)
                .WithOne(d => d.User)
                .HasForeignKey<Driver>(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // User - Addresses (One to Many)
            modelBuilder.Entity<User>()
                .HasMany(u => u.Addresses)
                .WithOne(a => a.User)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // User - Orders (One to Many) - با NoAction برای جلوگیری از cascade path مضاعف
            modelBuilder.Entity<User>()
                .HasMany(u => u.Orders)
                .WithOne(o => o.Customer)
                .HasForeignKey(o => o.CustomerId)
                .OnDelete(DeleteBehavior.NoAction);

            // User - Notifications (One to Many)
            modelBuilder.Entity<User>()
                .HasMany(u => u.Notifications)
                .WithOne(n => n.User)
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // ServiceCategory - Orders (One to Many)
            modelBuilder.Entity<ServiceCategory>()
                .HasMany(sc => sc.Orders)
                .WithOne(o => o.ServiceCategory)
                .HasForeignKey(o => o.ServiceCategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // CatalogCategory - CatalogItems (One to Many)
            modelBuilder.Entity<CatalogCategory>()
                .HasMany(cc => cc.Items)
                .WithOne(ci => ci.Category)
                .HasForeignKey(ci => ci.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            // Order - OrderItems (One to Many)
            modelBuilder.Entity<Order>()
                .HasMany(o => o.Items)
                .WithOne(oi => oi.Order)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // Order - PackingService (One to One)
            modelBuilder.Entity<Order>()
                .HasOne(o => o.PackingService)
                .WithOne(ps => ps.Order)
                .HasForeignKey<PackingService>(ps => ps.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // Order - LocationDetails (One to One)
            modelBuilder.Entity<Order>()
                .HasOne(o => o.LocationDetails)
                .WithOne(ld => ld.Order)
                .HasForeignKey<LocationDetails>(ld => ld.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // Order - DriverAssignment (One to One)
            modelBuilder.Entity<DriverAssignment>()
                .HasOne(da => da.Order)
                .WithOne(o => o.DriverAssignment)
                .HasForeignKey<DriverAssignment>(da => da.OrderId)
                .OnDelete(DeleteBehavior.NoAction);

            // Order - Payment (One to One)
            modelBuilder.Entity<Order>()
                .HasOne(o => o.Payment)
                .WithOne(p => p.Order)
                .HasForeignKey<Payment>(p => p.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // Driver - DriverAssignments (One to Many)
            modelBuilder.Entity<Driver>()
                .HasMany(d => d.Assignments)
                .WithOne(da => da.Driver)
                .HasForeignKey(da => da.DriverId)
                .OnDelete(DeleteBehavior.NoAction);

            // Driver - LocationUpdates (One to Many)
            modelBuilder.Entity<Driver>()
                .HasMany(d => d.LocationUpdates)
                .WithOne(lu => lu.Driver)
                .HasForeignKey(lu => lu.DriverId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indexes برای بهبود Performance
            modelBuilder.Entity<User>()
                .HasIndex(u => u.PhoneNumber)
                .IsUnique();

            modelBuilder.Entity<Order>()
                .HasIndex(o => o.Status);

            modelBuilder.Entity<Order>()
                .HasIndex(o => o.CustomerPhone);

            modelBuilder.Entity<DriverAssignment>()
                .HasIndex(da => da.DriverId);

            modelBuilder.Entity<DiscountCode>()
                .HasIndex(dc => dc.Code)
                .IsUnique();
        }
    }
}