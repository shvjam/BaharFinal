using BarbariBahar.API.Models;
using BarbariBahar.API.Enums;
using Microsoft.EntityFrameworkCore;

namespace BarbariBahar.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Driver> Drivers { get; set; }
        public virtual DbSet<Address> Addresses { get; set; }
        public virtual DbSet<ServiceCategory> ServiceCategories { get; set; }
        public virtual DbSet<CatalogCategory> CatalogCategories { get; set; }
        public virtual DbSet<CatalogItem> CatalogItems { get; set; }
        public virtual DbSet<PackingProduct> PackingProducts { get; set; }
        public virtual DbSet<Order> Orders { get; set; }
        public virtual DbSet<OrderItem> OrderItems { get; set; }
        public virtual DbSet<PackingService> PackingServices { get; set; }
        public virtual DbSet<LocationDetails> LocationDetails { get; set; }
        public virtual DbSet<DriverAssignment> DriverAssignments { get; set; }
        public virtual DbSet<Payment> Payments { get; set; }
        public virtual DbSet<LocationUpdate> LocationUpdates { get; set; }
        public virtual DbSet<PricingConfig> PricingConfigs { get; set; }
        public virtual DbSet<DiscountCode> DiscountCodes { get; set; }
        public virtual DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            if (Database.ProviderName == "Microsoft.EntityFrameworkCore.SqlServer")
            {
                modelBuilder.Entity<Order>().Property(p => p.DetailsJson).HasColumnType("nvarchar(max)");
                modelBuilder.Entity<Order>().Property(p => p.OriginAddressJson).HasColumnType("nvarchar(max)");
                modelBuilder.Entity<Order>().Property(p => p.DestinationAddressJson).HasColumnType("nvarchar(max)");
                modelBuilder.Entity<Order>().Property(p => p.StopsJson).HasColumnType("nvarchar(max)");
                modelBuilder.Entity<PackingService>().Property(p => p.PackingItemsJson).HasColumnType("nvarchar(max)");
                modelBuilder.Entity<PackingService>().Property(p => p.PackingProductsJson).HasColumnType("nvarchar(max)");
                modelBuilder.Entity<Payment>().Property(p => p.GatewayResponseJson).HasColumnType("nvarchar(max)");
                modelBuilder.Entity<Notification>().Property(p => p.DataJson).HasColumnType("nvarchar(max)");
                modelBuilder.Entity<PricingConfig>().Property(p => p.BaseVehicleRatesJson).HasColumnType("nvarchar(max)");
                modelBuilder.Entity<PricingConfig>().Property(p => p.WalkingDistanceRatesJson).HasColumnType("nvarchar(max)");
            }

            modelBuilder.Entity<User>().Property(u => u.Role).HasConversion<string>();
            modelBuilder.Entity<Order>().Property(o => o.Status).HasConversion<string>();
            modelBuilder.Entity<Driver>().Property(d => d.VehicleType).HasConversion<string>();
            modelBuilder.Entity<PackingService>().Property(ps => ps.Type).HasConversion<string>();
            modelBuilder.Entity<Payment>().Property(p => p.Status).HasConversion<string>();
            modelBuilder.Entity<Payment>().Property(p => p.Method).HasConversion<string>();

            modelBuilder.Entity<User>().HasOne(u => u.DriverProfile).WithOne(d => d.User).HasForeignKey<Driver>(d => d.UserId).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<User>().HasMany(u => u.Addresses).WithOne(a => a.User).HasForeignKey(a => a.UserId).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<User>().HasMany(u => u.Orders).WithOne(o => o.Customer).HasForeignKey(o => o.CustomerId).OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<User>().HasMany(u => u.Notifications).WithOne(n => n.User).HasForeignKey(n => n.UserId).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<ServiceCategory>().HasMany(sc => sc.Orders).WithOne(o => o.ServiceCategory).HasForeignKey(o => o.ServiceCategoryId).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<CatalogCategory>().HasMany(cc => cc.Items).WithOne(ci => ci.Category).HasForeignKey(ci => ci.CategoryId).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Order>().HasMany(o => o.Items).WithOne(oi => oi.Order).HasForeignKey(oi => oi.OrderId).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Order>().HasOne(o => o.PackingService).WithOne(ps => ps.Order).HasForeignKey<PackingService>(ps => ps.OrderId).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Order>().HasOne(o => o.LocationDetails).WithOne(ld => ld.Order).HasForeignKey<LocationDetails>(ld => ld.OrderId).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Order>().HasOne(o => o.DriverAssignment).WithOne().HasForeignKey<DriverAssignment>(da => da.OrderId).OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<Order>().HasOne(o => o.Payment).WithOne(p => p.Order).HasForeignKey<Payment>(p => p.OrderId).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Driver>().HasMany(d => d.Assignments).WithOne(da => da.Driver).HasForeignKey(da => da.DriverId).OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<Driver>().HasMany(d => d.LocationUpdates).WithOne(lu => lu.Driver).HasForeignKey(lu => lu.DriverId).OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>().HasIndex(u => u.PhoneNumber).IsUnique();
            modelBuilder.Entity<Order>().HasIndex(o => o.Status);
            modelBuilder.Entity<Order>().HasIndex(o => o.CustomerPhone);
            modelBuilder.Entity<DriverAssignment>().HasIndex(da => da.DriverId);
            modelBuilder.Entity<DiscountCode>().HasIndex(dc => dc.Code).IsUnique();
        }
    }
}
