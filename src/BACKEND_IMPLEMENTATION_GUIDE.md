# 🚀 راهنمای جامع پیاده‌سازی بک‌اند باربری بهار
## ASP.NET Core Web API + SQL Server + SignalR

---

## 📋 فهرست مطالب

1. [معماری و ساختار پروژه](#1-معماری-و-ساختار-پروژه)
2. [ایجاد پروژه و نصب پکیج‌ها](#2-ایجاد-پروژه-و-نصب-پکیجها)
3. [مدل‌های دیتابیس](#3-مدلهای-دیتابیس)
4. [Database Context](#4-database-context)
5. [DTOs](#5-dtos)
6. [Repository Pattern](#6-repository-pattern)
7. [Services](#7-services)
8. [Authentication & JWT](#8-authentication--jwt)
9. [Controllers](#9-controllers)
10. [SignalR برای Live Tracking](#10-signalr-برای-live-tracking)
11. [File Upload](#11-file-upload)
12. [CORS و Configuration](#12-cors-و-configuration)
13. [Migrations و Seed Data](#13-migrations-و-seed-data)
14. [Error Handling](#14-error-handling)
15. [چک‌لیست نهایی](#15-چکلیست-نهایی)

---

## 1. معماری و ساختار پروژه

### ساختار دایرکتوری‌های پروژه:

```
BarbariBahar.API/
├── Controllers/              # API Controllers
│   ├── AuthController.cs
│   ├── OrdersController.cs
│   ├── UsersController.cs
│   ├── DriversController.cs
│   ├── AddressesController.cs
│   ├── ServicesController.cs
│   ├── CatalogController.cs
│   ├── PackingController.cs
│   ├── PricingController.cs
│   ├── PaymentController.cs
│   ├── AdminController.cs
│   └── DashboardController.cs
│
├── Models/                   # Database Models (Entities)
│   ├── User.cs
│   ├── Driver.cs
│   ├── Order.cs
│   ├── OrderItem.cs
│   ├── Address.cs
│   ├── ServiceCategory.cs
│   ├── CatalogCategory.cs
│   ├── CatalogItem.cs
│   ├── PackingProduct.cs
│   ├── PackingService.cs
│   ├── LocationDetails.cs
│   ├── DriverAssignment.cs
│   ├── Payment.cs
│   ├── LocationUpdate.cs
│   ├── PricingConfig.cs
│   ├── DiscountCode.cs
│   └── Notification.cs
│
├── DTOs/                     # Data Transfer Objects
│   ├── Auth/
│   │   ├── LoginRequestDto.cs
│   │   ├── SendOtpRequestDto.cs
│   │   └── LoginResponseDto.cs
│   ├── Order/
│   │   ├── CreateOrderDto.cs
│   │   ├── UpdateOrderDto.cs
│   │   └── OrderResponseDto.cs
│   ├── User/
│   │   ├── UserDto.cs
│   │   └── UpdateUserDto.cs
│   ├── Driver/
│   │   ├── DriverDto.cs
│   │   ├── UpdateDriverDto.cs
│   │   └── DriverStatsDto.cs
│   └── Common/
│       ├── ApiResponse.cs
│       └── PaginatedResponse.cs
│
├── Data/                     # Database Context
│   ├── AppDbContext.cs
│   └── Migrations/
│
├── Repositories/             # Repository Pattern
│   ├── Interfaces/
│   │   ├── IGenericRepository.cs
│   │   ├── IUserRepository.cs
│   │   ├── IOrderRepository.cs
│   │   ├── IDriverRepository.cs
│   │   └── ...
│   └── Implementations/
│       ├── GenericRepository.cs
│       ├── UserRepository.cs
│       ├── OrderRepository.cs
│       ├── DriverRepository.cs
│       └── ...
│
├── Services/                 # Business Logic
│   ├── Interfaces/
│   │   ├── IAuthService.cs
│   │   ├── IOrderService.cs
│   │   ├── IDriverService.cs
│   │   ├── IPricingService.cs
│   │   ├── INotificationService.cs
│   │   ├── IFileService.cs
│   │   └── IOtpService.cs
│   └── Implementations/
│       ├── AuthService.cs
│       ├── OrderService.cs
│       ├── DriverService.cs
│       ├── PricingService.cs
│       ├── NotificationService.cs
│       ├── FileService.cs
│       └── OtpService.cs
│
├── Hubs/                     # SignalR Hubs
│   ├── OrderTrackingHub.cs
│   └── NotificationHub.cs
│
├── Helpers/                  # Helper Classes
│   ├── JwtHelper.cs
│   ├── DistanceCalculator.cs
│   └── Extensions.cs
│
├── Middleware/               # Custom Middleware
│   ├── ErrorHandlingMiddleware.cs
│   └── JwtMiddleware.cs
│
├── Enums/                    # Enums
│   ├── UserRole.cs
│   ├── OrderStatus.cs
│   ├── VehicleType.cs
│   ├── PaymentStatus.cs
│   └── ...
│
├── Uploads/                  # فایل‌های آپلود شده
│   ├── Profiles/
│   ├── Documents/
│   └── Vehicles/
│
├── appsettings.json
├── appsettings.Development.json
├── Program.cs
└── BarbariBahar.API.csproj
```

---

## 2. ایجاد پروژه و نصب پکیج‌ها

### ایجاد پروژه:

```bash
# ایجاد Solution
dotnet new sln -n BarbariBahar

# ایجاد Web API Project
dotnet new webapi -n BarbariBahar.API

# اضافه کردن پروژه به Solution
dotnet sln add BarbariBahar.API/BarbariBahar.API.csproj

# ورود به پروژه
cd BarbariBahar.API
```

### نصب NuGet Packages:

```bash
# Entity Framework Core برای SQL Server
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Microsoft.EntityFrameworkCore.Design

# JWT Authentication
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package System.IdentityModel.Tokens.Jwt

# SignalR (از قبل در ASP.NET Core موجود است)

# AutoMapper (برای mapping بین Models و DTOs)
dotnet add package AutoMapper
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection

# Serilog برای Logging
dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Sinks.File
dotnet add package Serilog.Sinks.Console

# FluentValidation (برای Validation)
dotnet add package FluentValidation
dotnet add package FluentValidation.AspNetCore

# Swashbuckle (Swagger - معمولاً از قبل هست)
dotnet add package Swashbuckle.AspNetCore

# برای کار با فایل‌ها
dotnet add package SixLabors.ImageSharp
```

---

## 3. مدل‌های دیتابیس

### 📁 Models/Enums.cs

```csharp
namespace BarbariBahar.API.Enums
{
    public enum UserRole
    {
        GUEST = 0,
        CUSTOMER = 1,
        DRIVER = 2,
        ADMIN = 3
    }

    public enum OrderStatus
    {
        DRAFT = 0,
        PENDING = 1,
        REVIEWING = 2,
        CONFIRMED = 3,
        DRIVER_ASSIGNED = 4,
        DRIVER_EN_ROUTE_TO_ORIGIN = 5,
        PACKING_IN_PROGRESS = 6,
        LOADING_IN_PROGRESS = 7,
        IN_TRANSIT = 8,
        ARRIVED_AT_DESTINATION = 9,
        COMPLETED = 10,
        CANCELLED = 11
    }

    public enum VehicleType
    {
        PICKUP = 0,    // وانت
        NISSAN = 1,    // نیسان
        TRUCK = 2,     // کامیون
        HEAVY_TRUCK = 3 // خاور
    }

    public enum PackingType
    {
        FULL = 0,         // بسته‌بندی تمام لوازم منزل
        LARGE_ITEMS = 1,  // لوازم بزرگ
        SMALL_ITEMS = 2,  // خرده‌ریزها
        OFFICE = 3        // لوازم اداری
    }

    public enum PaymentStatus
    {
        PENDING = 0,
        PAID = 1,
        FAILED = 2,
        REFUNDED = 3
    }

    public enum PaymentMethod
    {
        ONLINE = 0,
        CASH = 1,
        WALLET = 2
    }
}
```

### 📁 Models/User.cs

```csharp
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using BarbariBahar.API.Enums;

namespace BarbariBahar.API.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(11)]
        public string PhoneNumber { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? FullName { get; set; }

        [Required]
        public UserRole Role { get; set; } = UserRole.CUSTOMER;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation Properties
        public virtual ICollection<Address> Addresses { get; set; } = new List<Address>();
        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
        public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
        
        // برای رابطه یک به یک با Driver
        public virtual Driver? DriverProfile { get; set; }
    }
}
```

### 📁 Models/Driver.cs

```csharp
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BarbariBahar.API.Enums;

namespace BarbariBahar.API.Models
{
    public class Driver
    {
        [Key]
        [ForeignKey("User")]
        public Guid UserId { get; set; }

        [MaxLength(10)]
        public string? NationalId { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [MaxLength(500)]
        public string? Address { get; set; }

        // وسیله نقلیه
        [Required]
        [MaxLength(20)]
        public string LicensePlate { get; set; } = string.Empty;

        [Required]
        public VehicleType VehicleType { get; set; }

        [MaxLength(50)]
        public string? VehicleModel { get; set; }

        [MaxLength(30)]
        public string? VehicleColor { get; set; }

        public int? VehicleYear { get; set; }

        public int AvailableWorkers { get; set; } = 0;

        // مدارک
        [MaxLength(50)]
        public string? DriverLicenseNumber { get; set; }

        public DateTime? DriverLicenseExpiry { get; set; }

        [MaxLength(500)]
        public string? DriverLicenseImage { get; set; }

        [MaxLength(500)]
        public string? VehicleCardImage { get; set; }

        [MaxLength(500)]
        public string? InsuranceImage { get; set; }

        [MaxLength(500)]
        public string? ProfileImage { get; set; }

        public bool DocumentsVerified { get; set; } = false;
        public DateTime? VerifiedAt { get; set; }

        // اطلاعات بانکی
        [MaxLength(24)]
        public string? Sheba { get; set; }

        // آمار و وضعیت
        [Range(0, 5)]
        public double Rating { get; set; } = 5.0;

        public int TotalRides { get; set; } = 0;
        public int CompletedRides { get; set; } = 0;
        public int CancelledRides { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalEarnings { get; set; } = 0;

        // تنظیمات
        public bool IsActive { get; set; } = false;
        public bool IsOnline { get; set; } = false;

        [Range(0, 100)]
        public double CommissionPercentage { get; set; } = 20.0; // درصد کمیسیون

        public int Priority { get; set; } = 0;

        // موقعیت فعلی
        public double? CurrentLat { get; set; }
        public double? CurrentLng { get; set; }
        public DateTime? LastLocationUpdate { get; set; }

        // یادداشت ادمین
        [MaxLength(1000)]
        public string? AdminNote { get; set; }

        // Navigation Properties
        public virtual User User { get; set; } = null!;
        public virtual ICollection<DriverAssignment> Assignments { get; set; } = new List<DriverAssignment>();
        public virtual ICollection<LocationUpdate> LocationUpdates { get; set; } = new List<LocationUpdate>();
    }
}
```

### 📁 Models/Address.cs

```csharp
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarbariBahar.API.Models
{
    public class Address
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string FullAddress { get; set; } = string.Empty;

        [Required]
        public double Lat { get; set; }

        [Required]
        public double Lng { get; set; }

        [Required]
        [MaxLength(50)]
        public string District { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string City { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Province { get; set; } = string.Empty;

        [MaxLength(10)]
        public string? PostalCode { get; set; }

        [MaxLength(500)]
        public string? Details { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Property
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;
    }
}
```

### 📁 Models/ServiceCategory.cs

```csharp
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.Models
{
    public class ServiceCategory
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Slug { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? Icon { get; set; }

        public bool IsActive { get; set; } = true;

        public int Order { get; set; } = 0;

        // Navigation Properties
        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
```

### 📁 Models/CatalogCategory.cs

```csharp
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.Models
{
    public class CatalogCategory
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Slug { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        public int Order { get; set; } = 0;

        // Navigation Properties
        public virtual ICollection<CatalogItem> Items { get; set; } = new List<CatalogItem>();
    }
}
```

### 📁 Models/CatalogItem.cs

```csharp
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarbariBahar.API.Models
{
    public class CatalogItem
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid CategoryId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal BasePrice { get; set; }

        [Required]
        [MaxLength(50)]
        public string Unit { get; set; } = "عدد";

        public bool IsActive { get; set; } = true;

        public int Order { get; set; } = 0;

        // Navigation Property
        [ForeignKey("CategoryId")]
        public virtual CatalogCategory Category { get; set; } = null!;
    }
}
```

### 📁 Models/PackingProduct.cs

```csharp
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarbariBahar.API.Models
{
    public class PackingProduct
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Required]
        [MaxLength(50)]
        public string Unit { get; set; } = "عدد";

        [MaxLength(500)]
        public string? Image { get; set; }

        public int Stock { get; set; } = 0;

        public bool IsActive { get; set; } = true;
    }
}
```

### 📁 Models/Order.cs

```csharp
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BarbariBahar.API.Enums;

namespace BarbariBahar.API.Models
{
    public class Order
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid? CustomerId { get; set; }

        [Required]
        [MaxLength(11)]
        public string CustomerPhone { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? CustomerName { get; set; }

        [Required]
        public Guid ServiceCategoryId { get; set; }

        public Guid? DriverId { get; set; }

        [Required]
        public OrderStatus Status { get; set; } = OrderStatus.DRAFT;

        // زمان‌بندی
        [Required]
        public DateTime PreferredDateTime { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ConfirmedAt { get; set; }
        public DateTime? StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }

        // قیمت
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal EstimatedPrice { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? FinalPrice { get; set; }

        [MaxLength(50)]
        public string? DiscountCode { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? DiscountAmount { get; set; }

        // جزئیات سفارش (JSON)
        [Column(TypeName = "nvarchar(max)")]
        public string DetailsJson { get; set; } = "{}";

        // آدرس‌ها (JSON - فقط برای ذخیره snapshot)
        [Required]
        [Column(TypeName = "nvarchar(max)")]
        public string OriginAddressJson { get; set; } = "{}";

        [Required]
        [Column(TypeName = "nvarchar(max)")]
        public string DestinationAddressJson { get; set; } = "{}";

        [Column(TypeName = "nvarchar(max)")]
        public string? StopsJson { get; set; }

        // فاصله و زمان
        [Required]
        public double DistanceKm { get; set; }

        public int EstimatedDuration { get; set; } // دقیقه

        // یادداشت‌ها
        [MaxLength(1000)]
        public string? CustomerNote { get; set; }

        [MaxLength(1000)]
        public string? AdminNote { get; set; }

        [MaxLength(1000)]
        public string? DriverNote { get; set; }

        // امتیاز
        [Range(0, 5)]
        public double? Rating { get; set; }

        [MaxLength(1000)]
        public string? Review { get; set; }

        // لغو
        [MaxLength(500)]
        public string? CancellationReason { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? CancellationFee { get; set; }

        // Navigation Properties
        [ForeignKey("CustomerId")]
        public virtual User? Customer { get; set; }

        [ForeignKey("ServiceCategoryId")]
        public virtual ServiceCategory ServiceCategory { get; set; } = null!;

        public virtual ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
        public virtual PackingService? PackingService { get; set; }
        public virtual LocationDetails? LocationDetails { get; set; }
        public virtual DriverAssignment? DriverAssignment { get; set; }
        public virtual Payment? Payment { get; set; }
    }
}
```

### 📁 Models/OrderItem.cs

```csharp
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarbariBahar.API.Models
{
    public class OrderItem
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid OrderId { get; set; }

        [Required]
        public Guid CatalogItemId { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice { get; set; }

        // Navigation Properties
        [ForeignKey("OrderId")]
        public virtual Order Order { get; set; } = null!;

        [ForeignKey("CatalogItemId")]
        public virtual CatalogItem CatalogItem { get; set; } = null!;
    }
}
```

### 📁 Models/PackingService.cs

```csharp
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BarbariBahar.API.Enums;

namespace BarbariBahar.API.Models
{
    public class PackingService
    {
        [Key]
        [ForeignKey("Order")]
        public Guid OrderId { get; set; }

        [Required]
        public PackingType Type { get; set; }

        public int MaleWorkers { get; set; } = 0;
        public int FemaleWorkers { get; set; } = 0;

        public int EstimatedHours { get; set; }

        public bool NeedsMaterials { get; set; } = false;

        [MaxLength(20)]
        public string? MaterialsMode { get; set; } // "auto" یا "manual"

        // آیتم‌های بسته‌بندی (JSON)
        [Column(TypeName = "nvarchar(max)")]
        public string? PackingItemsJson { get; set; }

        // محصولات بسته‌بندی انتخاب شده (JSON)
        [Column(TypeName = "nvarchar(max)")]
        public string? PackingProductsJson { get; set; }

        // Navigation Property
        public virtual Order Order { get; set; } = null!;
    }
}
```

### 📁 Models/LocationDetails.cs

```csharp
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
```

### 📁 Models/DriverAssignment.cs

```csharp
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarbariBahar.API.Models
{
    public class DriverAssignment
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid OrderId { get; set; }

        [Required]
        public Guid DriverId { get; set; }

        [Required]
        [Range(0, 100)]
        public double Commission { get; set; } // درصد

        [Column(TypeName = "decimal(18,2)")]
        public decimal? CommissionAmount { get; set; }

        [MaxLength(500)]
        public string? Note { get; set; }

        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
        public DateTime? AcceptedAt { get; set; }
        public DateTime? RejectedAt { get; set; }

        [MaxLength(500)]
        public string? RejectionReason { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation Properties
        [ForeignKey("OrderId")]
        public virtual Order Order { get; set; } = null!;

        [ForeignKey("DriverId")]
        public virtual Driver Driver { get; set; } = null!;
    }
}
```

### 📁 Models/Payment.cs

```csharp
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BarbariBahar.API.Enums;

namespace BarbariBahar.API.Models
{
    public class Payment
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid OrderId { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        public PaymentStatus Status { get; set; } = PaymentStatus.PENDING;

        [Required]
        public PaymentMethod Method { get; set; }

        [MaxLength(100)]
        public string? GatewayTransactionId { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string? GatewayResponseJson { get; set; }

        public DateTime? PaidAt { get; set; }
        public DateTime? RefundedAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Property
        [ForeignKey("OrderId")]
        public virtual Order Order { get; set; } = null!;
    }
}
```

### 📁 Models/LocationUpdate.cs

```csharp
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarbariBahar.API.Models
{
    public class LocationUpdate
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid DriverId { get; set; }

        [Required]
        public Guid OrderId { get; set; }

        [Required]
        public double Lat { get; set; }

        [Required]
        public double Lng { get; set; }

        public double? Heading { get; set; }
        public double? Speed { get; set; }
        public double? Accuracy { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        // Navigation Property
        [ForeignKey("DriverId")]
        public virtual Driver Driver { get; set; } = null!;
    }
}
```

### 📁 Models/PricingConfig.cs

```csharp
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarbariBahar.API.Models
{
    public class PricingConfig
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = "پیش‌فرض";

        [Column(TypeName = "decimal(18,2)")]
        public decimal BaseWorkerRate { get; set; }

        // نرخ هر نوع خودرو (JSON)
        [Required]
        [Column(TypeName = "nvarchar(max)")]
        public string BaseVehicleRatesJson { get; set; } = "{}";

        [Column(TypeName = "decimal(18,2)")]
        public decimal PerKmRate { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal PerFloorRate { get; set; }

        // نرخ پیاده‌روی (JSON)
        [Column(TypeName = "nvarchar(max)")]
        public string WalkingDistanceRatesJson { get; set; } = "{}";

        [Column(TypeName = "decimal(18,2)")]
        public decimal StopRate { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal PackingHourlyRate { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal CancellationFee { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal ExpertVisitFee { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
```

### 📁 Models/DiscountCode.cs

```csharp
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarbariBahar.API.Models
{
    public class DiscountCode
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(50)]
        public string Code { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Type { get; set; } = "PERCENTAGE"; // PERCENTAGE یا FIXED

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Value { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? MaxDiscount { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? MinOrderAmount { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public int? UsageLimit { get; set; }
        public int UsageCount { get; set; } = 0;

        public int? PerUserLimit { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
```

### 📁 Models/Notification.cs

```csharp
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarbariBahar.API.Models
{
    public class Notification
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }

        [Required]
        [MaxLength(20)]
        public string Type { get; set; } = "INFO"; // INFO, SUCCESS, WARNING, ERROR

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(1000)]
        public string Message { get; set; } = string.Empty;

        public bool IsRead { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column(TypeName = "nvarchar(max)")]
        public string? DataJson { get; set; }

        // Navigation Property
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;
    }
}
```

---

## 4. Database Context

### 📁 Data/AppDbContext.cs

```csharp
using Microsoft.EntityFrameworkCore;
using BarbariBahar.API.Models;

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
            modelBuilder.Entity<Order>()
                .HasOne(o => o.DriverAssignment)
                .WithOne()
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
```

---

## 5. DTOs

### 📁 DTOs/Common/ApiResponse.cs

```csharp
namespace BarbariBahar.API.DTOs.Common
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public T? Data { get; set; }
        public string? Message { get; set; }
        public string? Error { get; set; }

        public static ApiResponse<T> SuccessResponse(T data, string? message = null)
        {
            return new ApiResponse<T>
            {
                Success = true,
                Data = data,
                Message = message
            };
        }

        public static ApiResponse<T> ErrorResponse(string error)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Error = error
            };
        }
    }
}
```

### 📁 DTOs/Common/PaginatedResponse.cs

```csharp
using System.Collections.Generic;

namespace BarbariBahar.API.DTOs.Common
{
    public class PaginatedResponse<T>
    {
        public List<T> Items { get; set; } = new List<T>();
        public int Total { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }
}
```

### 📁 DTOs/Auth/SendOtpRequestDto.cs

```csharp
using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.DTOs.Auth
{
    public class SendOtpRequestDto
    {
        [Required(ErrorMessage = "شماره تلفن الزامی است")]
        [RegularExpression(@"^09\d{9}$", ErrorMessage = "فرمت شماره تلفن صحیح نیست")]
        public string PhoneNumber { get; set; } = string.Empty;
    }
}
```

### 📁 DTOs/Auth/LoginRequestDto.cs

```csharp
using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.DTOs.Auth
{
    public class LoginRequestDto
    {
        [Required(ErrorMessage = "شماره تلفن الزامی است")]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "کد تایید الزامی است")]
        [StringLength(4, MinimumLength = 4, ErrorMessage = "کد تایید باید 4 رقم باشد")]
        public string Otp { get; set; } = string.Empty;
    }
}
```

### 📁 DTOs/Auth/LoginResponseDto.cs

```csharp
using BarbariBahar.API.Enums;

namespace BarbariBahar.API.DTOs.Auth
{
    public class LoginResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? FullName { get; set; }
        public UserRole Role { get; set; }
    }
}
```

### 📁 DTOs/Order/CreateOrderDto.cs

```csharp
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.DTOs.Order
{
    public class CreateOrderDto
    {
        [Required]
        public string CustomerPhone { get; set; } = string.Empty;

        public string? CustomerName { get; set; }

        [Required]
        public Guid ServiceCategoryId { get; set; }

        [Required]
        public DateTime PreferredDateTime { get; set; }

        [Required]
        public CreateOrderAddressDto OriginAddress { get; set; } = null!;

        [Required]
        public CreateOrderAddressDto DestinationAddress { get; set; } = null!;

        public List<CreateOrderAddressDto>? Stops { get; set; }

        [Required]
        public double DistanceKm { get; set; }

        public int EstimatedDuration { get; set; }

        [Required]
        public OrderDetailsDto Details { get; set; } = null!;

        public List<CreateOrderItemDto>? Items { get; set; }

        public CreatePackingServiceDto? PackingService { get; set; }

        public CreateLocationDetailsDto? LocationDetails { get; set; }

        public string? CustomerNote { get; set; }
    }

    public class CreateOrderAddressDto
    {
        public string Title { get; set; } = string.Empty;
        public string FullAddress { get; set; } = string.Empty;
        public double Lat { get; set; }
        public double Lng { get; set; }
        public string District { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;
        public string? PostalCode { get; set; }
        public string? Details { get; set; }
    }

    public class OrderDetailsDto
    {
        public bool NeedsPacking { get; set; }
        public bool NeedsWorkers { get; set; }
        public int WorkerCount { get; set; }
        public string VehicleType { get; set; } = string.Empty;
    }

    public class CreateOrderItemDto
    {
        public Guid CatalogItemId { get; set; }
        public int Quantity { get; set; }
    }

    public class CreatePackingServiceDto
    {
        public string Type { get; set; } = string.Empty;
        public int MaleWorkers { get; set; }
        public int FemaleWorkers { get; set; }
        public int EstimatedHours { get; set; }
        public bool NeedsMaterials { get; set; }
        public string? MaterialsMode { get; set; }
        public string? PackingItemsJson { get; set; }
        public string? PackingProductsJson { get; set; }
    }

    public class CreateLocationDetailsDto
    {
        public int OriginFloor { get; set; }
        public bool OriginHasElevator { get; set; }
        public int DestinationFloor { get; set; }
        public bool DestinationHasElevator { get; set; }
        public int WalkDistanceMeters { get; set; }
        public int StopCount { get; set; }
    }
}
```

---

## 6. Repository Pattern

### 📁 Repositories/Interfaces/IGenericRepository.cs

```csharp
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace BarbariBahar.API.Repositories.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        Task<T?> GetByIdAsync(Guid id);
        Task<IEnumerable<T>> GetAllAsync();
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
        Task<T> AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(T entity);
        Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null);
        Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate);
    }
}
```

### 📁 Repositories/Implementations/GenericRepository.cs

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using BarbariBahar.API.Data;
using BarbariBahar.API.Repositories.Interfaces;

namespace BarbariBahar.API.Repositories.Implementations
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected readonly AppDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public GenericRepository(AppDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public virtual async Task<T?> GetByIdAsync(Guid id)
        {
            return await _dbSet.FindAsync(id);
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public virtual async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.Where(predicate).ToListAsync();
        }

        public virtual async Task<T> AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public virtual async Task UpdateAsync(T entity)
        {
            _dbSet.Update(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task DeleteAsync(T entity)
        {
            _dbSet.Remove(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null)
        {
            return predicate == null 
                ? await _dbSet.CountAsync() 
                : await _dbSet.CountAsync(predicate);
        }

        public virtual async Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.AnyAsync(predicate);
        }
    }
}
```

---

## 7. Services

### 📁 Services/Interfaces/IOtpService.cs

```csharp
using System.Threading.Tasks;

namespace BarbariBahar.API.Services.Interfaces
{
    public interface IOtpService
    {
        Task<string> GenerateOtpAsync(string phoneNumber);
        Task<bool> ValidateOtpAsync(string phoneNumber, string otp);
        Task SendOtpAsync(string phoneNumber, string otp);
    }
}
```

### 📁 Services/Implementations/OtpService.cs

```csharp
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BarbariBahar.API.Services.Interfaces;

namespace BarbariBahar.API.Services.Implementations
{
    public class OtpService : IOtpService
    {
        // در محیط واقعی از Redis استفاده کنید
        private static Dictionary<string, (string otp, DateTime expiry)> _otpStorage = new();

        public async Task<string> GenerateOtpAsync(string phoneNumber)
        {
            // تولید کد 4 رقمی تصادفی
            var random = new Random();
            var otp = random.Next(1000, 9999).ToString();

            // ذخیره با 2 دقیقه اعتبار
            _otpStorage[phoneNumber] = (otp, DateTime.UtcNow.AddMinutes(2));

            return await Task.FromResult(otp);
        }

        public async Task<bool> ValidateOtpAsync(string phoneNumber, string otp)
        {
            if (!_otpStorage.ContainsKey(phoneNumber))
                return false;

            var (storedOtp, expiry) = _otpStorage[phoneNumber];

            // چک کردن انقضا
            if (DateTime.UtcNow > expiry)
            {
                _otpStorage.Remove(phoneNumber);
                return false;
            }

            // چک کردن صحت کد
            if (storedOtp != otp)
                return false;

            // حذف کد استفاده شده
            _otpStorage.Remove(phoneNumber);

            return await Task.FromResult(true);
        }

        public async Task SendOtpAsync(string phoneNumber, string otp)
        {
            // TODO: یکپارچه‌سازی با سرویس SMS (کاوه‌نگار، فراز SMS، ...)
            // برای تست فقط لاگ می‌کنیم
            Console.WriteLine($"[OTP] Sending OTP {otp} to {phoneNumber}");
            
            await Task.CompletedTask;
        }
    }
}
```

### 📁 Services/Interfaces/IAuthService.cs

```csharp
using System.Threading.Tasks;
using BarbariBahar.API.DTOs.Auth;

namespace BarbariBahar.API.Services.Interfaces
{
    public interface IAuthService
    {
        Task<string> SendOtpAsync(string phoneNumber);
        Task<LoginResponseDto> LoginAsync(string phoneNumber, string otp);
    }
}
```

### 📁 Services/Implementations/AuthService.cs

```csharp
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using BarbariBahar.API.Data;
using BarbariBahar.API.DTOs.Auth;
using BarbariBahar.API.Enums;
using BarbariBahar.API.Helpers;
using BarbariBahar.API.Models;
using BarbariBahar.API.Services.Interfaces;

namespace BarbariBahar.API.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IOtpService _otpService;
        private readonly JwtHelper _jwtHelper;

        public AuthService(AppDbContext context, IOtpService otpService, JwtHelper jwtHelper)
        {
            _context = context;
            _otpService = otpService;
            _jwtHelper = jwtHelper;
        }

        public async Task<string> SendOtpAsync(string phoneNumber)
        {
            var otp = await _otpService.GenerateOtpAsync(phoneNumber);
            await _otpService.SendOtpAsync(phoneNumber, otp);
            
            return "کد تایید با موفقیت ارسال شد";
        }

        public async Task<LoginResponseDto> LoginAsync(string phoneNumber, string otp)
        {
            // اعتبارسنجی OTP
            var isValid = await _otpService.ValidateOtpAsync(phoneNumber, otp);
            if (!isValid)
            {
                throw new UnauthorizedAccessException("کد تایید نامعتبر یا منقضی شده است");
            }

            // پیدا کردن یا ایجاد کاربر
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.PhoneNumber == phoneNumber);

            if (user == null)
            {
                // ایجاد کاربر جدید
                user = new User
                {
                    PhoneNumber = phoneNumber,
                    Role = UserRole.CUSTOMER,
                    CreatedAt = DateTime.UtcNow
                };

                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();
            }
            else
            {
                // آپدیت زمان آخرین ورود
                user.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }

            // تولید JWT Token
            var token = _jwtHelper.GenerateToken(user);

            return new LoginResponseDto
            {
                Token = token,
                UserId = user.Id.ToString(),
                PhoneNumber = user.PhoneNumber,
                FullName = user.FullName,
                Role = user.Role
            };
        }
    }
}
```

### 📁 Services/Interfaces/IPricingService.cs

```csharp
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BarbariBahar.API.DTOs.Order;

namespace BarbariBahar.API.Services.Interfaces
{
    public interface IPricingService
    {
        Task<decimal> CalculateOrderPriceAsync(CreateOrderDto orderDto);
        Task<List<PriceBreakdownDto>> GetPriceBreakdownAsync(CreateOrderDto orderDto);
    }

    public class PriceBreakdownDto
    {
        public string Label { get; set; } = string.Empty;
        public int? Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public string? Description { get; set; }
    }
}
```

---

## 8. Authentication & JWT

### 📁 Helpers/JwtHelper.cs

```csharp
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using BarbariBahar.API.Models;

namespace BarbariBahar.API.Helpers
{
    public class JwtHelper
    {
        private readonly IConfiguration _configuration;

        public JwtHelper(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]!));
            
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.MobilePhone, user.PhoneNumber),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
                new Claim(ClaimTypes.Name, user.FullName ?? user.PhoneNumber)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(30),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public Guid? ValidateToken(string token)
        {
            if (string.IsNullOrEmpty(token))
                return null;

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]!);

            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _configuration["Jwt:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = _configuration["Jwt:Audience"],
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var userId = Guid.Parse(jwtToken.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);

                return userId;
            }
            catch
            {
                return null;
            }
        }
    }
}
```

---

## 9. Controllers

### 📁 Controllers/AuthController.cs

```csharp
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using BarbariBahar.API.DTOs.Auth;
using BarbariBahar.API.DTOs.Common;
using BarbariBahar.API.Services.Interfaces;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("send-otp")]
        public async Task<ActionResult<ApiResponse<string>>> SendOtp([FromBody] SendOtpRequestDto request)
        {
            try
            {
                var message = await _authService.SendOtpAsync(request.PhoneNumber);
                return Ok(ApiResponse<string>.SuccessResponse(message));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<string>.ErrorResponse(ex.Message));
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse<LoginResponseDto>>> Login([FromBody] LoginRequestDto request)
        {
            try
            {
                var response = await _authService.LoginAsync(request.PhoneNumber, request.Otp);
                return Ok(ApiResponse<LoginResponseDto>.SuccessResponse(response));
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ApiResponse<LoginResponseDto>.ErrorResponse(ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<LoginResponseDto>.ErrorResponse(ex.Message));
            }
        }
    }
}
```

### 📁 Controllers/OrdersController.cs

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BarbariBahar.API.Data;
using BarbariBahar.API.DTOs.Common;
using BarbariBahar.API.DTOs.Order;
using BarbariBahar.API.Enums;
using BarbariBahar.API.Models;
using BarbariBahar.API.Services.Interfaces;
using Newtonsoft.Json;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IPricingService _pricingService;

        public OrdersController(AppDbContext context, IPricingService pricingService)
        {
            _context = context;
            _pricingService = pricingService;
        }

        // ثبت سفارش جدید
        [HttpPost]
        public async Task<ActionResult<ApiResponse<Order>>> CreateOrder([FromBody] CreateOrderDto dto)
        {
            try
            {
                var order = new Order
                {
                    CustomerPhone = dto.CustomerPhone,
                    CustomerName = dto.CustomerName,
                    ServiceCategoryId = dto.ServiceCategoryId,
                    PreferredDateTime = dto.PreferredDateTime,
                    DistanceKm = dto.DistanceKm,
                    EstimatedDuration = dto.EstimatedDuration,
                    Status = OrderStatus.PENDING,
                    
                    // آدرس‌ها (ذخیره به صورت JSON)
                    OriginAddressJson = JsonConvert.SerializeObject(dto.OriginAddress),
                    DestinationAddressJson = JsonConvert.SerializeObject(dto.DestinationAddress),
                    StopsJson = dto.Stops != null ? JsonConvert.SerializeObject(dto.Stops) : null,
                    
                    // جزئیات
                    DetailsJson = JsonConvert.SerializeObject(dto.Details),
                    CustomerNote = dto.CustomerNote
                };

                // محاسبه قیمت
                order.EstimatedPrice = await _pricingService.CalculateOrderPriceAsync(dto);

                // اگر کاربر لاگین کرده
                if (User.Identity?.IsAuthenticated == true)
                {
                    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                    if (userId != null)
                    {
                        order.CustomerId = Guid.Parse(userId);
                    }
                }

                await _context.Orders.AddAsync(order);
                await _context.SaveChangesAsync();

                // اضافه کردن آیتم‌ها
                if (dto.Items != null && dto.Items.Any())
                {
                    foreach (var itemDto in dto.Items)
                    {
                        var catalogItem = await _context.CatalogItems.FindAsync(itemDto.CatalogItemId);
                        if (catalogItem != null)
                        {
                            var orderItem = new OrderItem
                            {
                                OrderId = order.Id,
                                CatalogItemId = itemDto.CatalogItemId,
                                Quantity = itemDto.Quantity,
                                UnitPrice = catalogItem.BasePrice,
                                TotalPrice = catalogItem.BasePrice * itemDto.Quantity
                            };
                            await _context.OrderItems.AddAsync(orderItem);
                        }
                    }
                }

                // اضافه کردن سرویس بسته‌بندی
                if (dto.PackingService != null)
                {
                    var packingService = new PackingService
                    {
                        OrderId = order.Id,
                        Type = Enum.Parse<PackingType>(dto.PackingService.Type),
                        MaleWorkers = dto.PackingService.MaleWorkers,
                        FemaleWorkers = dto.PackingService.FemaleWorkers,
                        EstimatedHours = dto.PackingService.EstimatedHours,
                        NeedsMaterials = dto.PackingService.NeedsMaterials,
                        MaterialsMode = dto.PackingService.MaterialsMode,
                        PackingItemsJson = dto.PackingService.PackingItemsJson,
                        PackingProductsJson = dto.PackingService.PackingProductsJson
                    };
                    await _context.PackingServices.AddAsync(packingService);
                }

                // اضافه کردن جزئیات مکانی
                if (dto.LocationDetails != null)
                {
                    var locationDetails = new LocationDetails
                    {
                        OrderId = order.Id,
                        OriginFloor = dto.LocationDetails.OriginFloor,
                        OriginHasElevator = dto.LocationDetails.OriginHasElevator,
                        DestinationFloor = dto.LocationDetails.DestinationFloor,
                        DestinationHasElevator = dto.LocationDetails.DestinationHasElevator,
                        WalkDistanceMeters = dto.LocationDetails.WalkDistanceMeters,
                        StopCount = dto.LocationDetails.StopCount
                    };
                    await _context.LocationDetails.AddAsync(locationDetails);
                }

                await _context.SaveChangesAsync();

                return Ok(ApiResponse<Order>.SuccessResponse(order, "سفارش با موفقیت ثبت شد"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<Order>.ErrorResponse(ex.Message));
            }
        }

        // دریافت لیست سفارشات کاربر
        [Authorize(Roles = "CUSTOMER")]
        [HttpGet("my-orders")]
        public async Task<ActionResult<ApiResponse<List<Order>>>> GetMyOrders()
        {
            try
            {
                var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                
                var orders = await _context.Orders
                    .Where(o => o.CustomerId == userId)
                    .Include(o => o.ServiceCategory)
                    .Include(o => o.Items)
                    .OrderByDescending(o => o.CreatedAt)
                    .ToListAsync();

                return Ok(ApiResponse<List<Order>>.SuccessResponse(orders));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<List<Order>>.ErrorResponse(ex.Message));
            }
        }

        // دریافت جزئیات سفارش
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<Order>>> GetOrderById(Guid id)
        {
            try
            {
                var order = await _context.Orders
                    .Include(o => o.ServiceCategory)
                    .Include(o => o.Items).ThenInclude(i => i.CatalogItem)
                    .Include(o => o.PackingService)
                    .Include(o => o.LocationDetails)
                    .Include(o => o.DriverAssignment).ThenInclude(da => da.Driver).ThenInclude(d => d.User)
                    .Include(o => o.Payment)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (order == null)
                    return NotFound(ApiResponse<Order>.ErrorResponse("سفارش یافت نشد"));

                return Ok(ApiResponse<Order>.SuccessResponse(order));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<Order>.ErrorResponse(ex.Message));
            }
        }
    }
}
```

---

## 10. SignalR برای Live Tracking

### 📁 Hubs/OrderTrackingHub.cs

```csharp
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using BarbariBahar.API.Data;
using BarbariBahar.API.Models;

namespace BarbariBahar.API.Hubs
{
    public class OrderTrackingHub : Hub
    {
        private readonly AppDbContext _context;

        public OrderTrackingHub(AppDbContext context)
        {
            _context = context;
        }

        // راننده به گروه سفارش می‌پیوندد
        public async Task JoinOrderGroup(string orderId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"order-{orderId}");
        }

        // راننده موقعیت خود را آپدیت می‌کند
        public async Task UpdateDriverLocation(string orderId, string driverId, double lat, double lng, double? heading, double? speed)
        {
            try
            {
                var driverGuid = Guid.Parse(driverId);
                var orderGuid = Guid.Parse(orderId);

                // ذخیره در دیتابیس
                var locationUpdate = new LocationUpdate
                {
                    DriverId = driverGuid,
                    OrderId = orderGuid,
                    Lat = lat,
                    Lng = lng,
                    Heading = heading,
                    Speed = speed,
                    Timestamp = DateTime.UtcNow
                };

                await _context.LocationUpdates.AddAsync(locationUpdate);
                
                // آپدیت موقعیت فعلی راننده
                var driver = await _context.Drivers.FindAsync(driverGuid);
                if (driver != null)
                {
                    driver.CurrentLat = lat;
                    driver.CurrentLng = lng;
                    driver.LastLocationUpdate = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();

                // ارسال به تمام کلاینت‌های در گروه سفارش
                await Clients.Group($"order-{orderId}").SendAsync("ReceiveLocationUpdate", new
                {
                    driverId,
                    orderId,
                    lat,
                    lng,
                    heading,
                    speed,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating location: {ex.Message}");
            }
        }

        // آپدیت وضعیت سفارش
        public async Task UpdateOrderStatus(string orderId, string status)
        {
            await Clients.Group($"order-{orderId}").SendAsync("OrderStatusUpdated", new
            {
                orderId,
                status,
                timestamp = DateTime.UtcNow
            });
        }
    }
}
```

---

## 11. File Upload

### 📁 Services/Interfaces/IFileService.cs

```csharp
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace BarbariBahar.API.Services.Interfaces
{
    public interface IFileService
    {
        Task<string> UploadFileAsync(IFormFile file, string folder);
        Task<bool> DeleteFileAsync(string filePath);
    }
}
```

### 📁 Services/Implementations/FileService.cs

```csharp
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using BarbariBahar.API.Services.Interfaces;

namespace BarbariBahar.API.Services.Implementations
{
    public class FileService : IFileService
    {
        private readonly string _uploadPath;

        public FileService()
        {
            _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
            
            // ایجاد پوشه اگر وجود ندارد
            if (!Directory.Exists(_uploadPath))
                Directory.CreateDirectory(_uploadPath);
        }

        public async Task<string> UploadFileAsync(IFormFile file, string folder)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("فایل معتبر نیست");

            // ایجاد پوشه
            var folderPath = Path.Combine(_uploadPath, folder);
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            // تولید نام یونیک
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(folderPath, fileName);

            // ذخیره فایل
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // برگرداندن مسیر نسبی
            return $"/uploads/{folder}/{fileName}";
        }

        public async Task<bool> DeleteFileAsync(string filePath)
        {
            try
            {
                if (string.IsNullOrEmpty(filePath))
                    return false;

                var fullPath = Path.Combine(Directory.GetCurrentDirectory(), filePath.TrimStart('/'));
                
                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                    return await Task.FromResult(true);
                }

                return false;
            }
            catch
            {
                return false;
            }
        }
    }
}
```

---

## 12. CORS و Configuration

### 📁 appsettings.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=BarbariBahar;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "SecretKey": "YOUR_SUPER_SECRET_KEY_AT_LEAST_32_CHARACTERS_LONG!",
    "Issuer": "BarbariBaharAPI",
    "Audience": "BarbariBaharClient"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

### 📁 Program.cs

```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using BarbariBahar.API.Data;
using BarbariBahar.API.Helpers;
using BarbariBahar.API.Hubs;
using BarbariBahar.API.Services.Implementations;
using BarbariBahar.API.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]!)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ClockSkew = TimeSpan.Zero
        };

        // برای SignalR
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });

// Services
builder.Services.AddScoped<JwtHelper>();
builder.Services.AddScoped<IOtpService, OtpService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<IPricingService, PricingService>();

// SignalR
builder.Services.AddSignalR();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials(); // برای SignalR
    });
});

builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Barbari Bahar API", Version = "v1" });
    
    // JWT در Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// فایل‌های استاتیک (برای Uploads)
app.UseStaticFiles();

app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// SignalR Hubs
app.MapHub<OrderTrackingHub>("/hubs/order-tracking");

app.Run();
```

---

## 13. Migrations و Seed Data

### ایجاد Migration:

```bash
# ایجاد اولین Migration
dotnet ef migrations add InitialCreate

# اعمال Migration به دیتابیس
dotnet ef database update
```

### Seed Data (اختیاری):

در `Program.cs` بعد از `var app = builder.Build();`:

```csharp
// Seed Data
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    
    // اگر دیتابیس خالی است
    if (!context.ServiceCategories.Any())
    {
        // خدمات
        var services = new[]
        {
            new ServiceCategory { Name = "اسباب‌کشی منزل", Slug = "home-moving", Description = "حمل کامل اثاثیه منزل", Order = 1, IsActive = true },
            new ServiceCategory { Name = "اسباب‌کشی اداری", Slug = "office-moving", Description = "حمل تجهیزات اداری", Order = 2, IsActive = true },
            new ServiceCategory { Name = "بارگیری و تخلیه", Slug = "loading-unloading", Description = "فقط بارگیری و تخلیه", Order = 3, IsActive = true }
        };
        context.ServiceCategories.AddRange(services);

        // کاتالوگ
        var catalogCategory = new CatalogCategory { Name = "لوازم سنگین", Slug = "heavy-items", Order = 1 };
        context.CatalogCategories.Add(catalogCategory);
        context.SaveChanges();

        var catalogItems = new[]
        {
            new CatalogItem { CategoryId = catalogCategory.Id, Name = "یخچال", BasePrice = 50000, Unit = "عدد", Order = 1 },
            new CatalogItem { CategoryId = catalogCategory.Id, Name = "لباسشویی", BasePrice = 40000, Unit = "عدد", Order = 2 },
            new CatalogItem { CategoryId = catalogCategory.Id, Name = "کولر", BasePrice = 35000, Unit = "عدد", Order = 3 }
        };
        context.CatalogItems.AddRange(catalogItems);

        // قیمت‌گذاری
        var pricing = new PricingConfig
        {
            Name = "تعرفه پیش‌فرض",
            BaseWorkerRate = 200000,
            BaseVehicleRatesJson = "{\"PICKUP\":500000,\"NISSAN\":800000,\"TRUCK\":1200000,\"HEAVY_TRUCK\":1500000}",
            PerKmRate = 5000,
            PerFloorRate = 20000,
            WalkingDistanceRatesJson = "{\"10\":10000,\"20\":20000,\"50\":50000}",
            StopRate = 50000,
            PackingHourlyRate = 300000,
            CancellationFee = 100000,
            ExpertVisitFee = 200000,
            IsActive = true
        };
        context.PricingConfigs.Add(pricing);

        context.SaveChanges();
    }
}
```

---

## 14. Error Handling

### 📁 Middleware/ErrorHandlingMiddleware.cs

```csharp
using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using BarbariBahar.API.DTOs.Common;

namespace BarbariBahar.API.Middleware
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;

        public ErrorHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var code = HttpStatusCode.InternalServerError;
            var message = "خطای سرور. لطفاً دوباره تلاش کنید.";

            if (exception is UnauthorizedAccessException)
            {
                code = HttpStatusCode.Unauthorized;
                message = exception.Message;
            }
            else if (exception is ArgumentException)
            {
                code = HttpStatusCode.BadRequest;
                message = exception.Message;
            }

            var result = JsonSerializer.Serialize(new ApiResponse<object>
            {
                Success = false,
                Error = message
            });

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)code;

            return context.Response.WriteAsync(result);
        }
    }
}
```

در `Program.cs` اضافه کنید:

```csharp
app.UseMiddleware<ErrorHandlingMiddleware>();
```

---

## 15. چک‌لیست نهایی

### ✅ نصب و راه‌اندازی:

1. ✅ .NET 8 SDK نصب شده
2. ✅ SQL Server نصب شده
3. ✅ پروژه ایجاد شده با `dotnet new webapi`
4. ✅ تمام NuGet Packages نصب شده
5. ✅ Connection String در `appsettings.json` تنظیم شده

### ✅ مدل‌ها و دیتابیس:

6. ✅ تمام Models ایجاد شده
7. ✅ Enums تعریف شده
8. ✅ AppDbContext پیاده‌سازی شده
9. ✅ Relationships تنظیم شده
10. ✅ Migration ایجاد و اعمال شده

### ✅ Authentication:

11. ✅ JWT Configuration تنظیم شده
12. ✅ JwtHelper ایجاد شده
13. ✅ OtpService پیاده‌سازی شده
14. ✅ AuthService پیاده‌سازی شده
15. ✅ AuthController ایجاد شده

### ✅ Services:

16. ✅ Repository Pattern پیاده‌سازی شده
17. ✅ PricingService پیاده‌سازی شده
18. ✅ FileService پیاده‌سازی شده
19. ✅ NotificationService (اختیاری)

### ✅ Controllers:

20. ✅ OrdersController
21. ✅ DriversController
22. ✅ AddressesController
23. ✅ ServicesController
24. ✅ CatalogController
25. ✅ AdminController

### ✅ Real-time:

26. ✅ SignalR Hub پیاده‌سازی شده
27. ✅ Location Tracking فعال شده

### ✅ امنیت و Performance:

28. ✅ CORS تنظیم شده
29. ✅ Error Handling Middleware
30. ✅ Logging (Serilog)
31. ✅ Validation (FluentValidation)

---

## 🚀 اجرای پروژه

```bash
# اجرای پروژه
dotnet run

# یا با Watch Mode
dotnet watch run
```

API در `https://localhost:5001` در دسترس است.

Swagger UI: `https://localhost:5001/swagger`

---

## 📞 اتصال به React Frontend

در React (`src/services/api.ts`):

```typescript
import axios from 'axios';

const API_BASE_URL = 'https://localhost:5001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor برای افزودن Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  sendOtp: (phoneNumber: string) => 
    api.post('/Auth/send-otp', { phoneNumber }),
  
  login: (phoneNumber: string, otp: string) => 
    api.post('/Auth/login', { phoneNumber, otp }),
};

// Orders APIs
export const ordersAPI = {
  create: (data: any) => api.post('/Orders', data),
  getMyOrders: () => api.get('/Orders/my-orders'),
  getById: (id: string) => api.get(`/Orders/${id}`),
};
```

### SignalR Connection:

```typescript
import * as signalR from '@microsoft/signalr';

const connection = new signalR.HubConnectionBuilder()
  .withUrl('https://localhost:5001/hubs/order-tracking', {
    accessTokenFactory: () => localStorage.getItem('token') || '',
  })
  .withAutomaticReconnect()
  .build();

connection.on('ReceiveLocationUpdate', (data) => {
  console.log('Location update:', data);
  // آپدیت نقشه
});

await connection.start();
await connection.invoke('JoinOrderGroup', orderId);
```

---

این راهنما یک **ساختار حرفه‌ای و production-ready** برای بک‌اند شما ارائه می‌دهد. می‌توانید بر اساس نیاز، بخش‌های اضافی مثل Payment Gateway، Notification Service (Push Notification)، و ... را اضافه کنید.

آیا سوالی دارید یا نیاز به توضیح بیشتر در مورد هر بخشی دارید؟
