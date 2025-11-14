using BarbariBahar.API.Enums;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using BarbariBahar.API.Data;
using BarbariBahar.API.Helpers;
using BarbariBahar.API.Hubs;
using BarbariBahar.API.Middleware;
using BarbariBahar.API.Models;
using BarbariBahar.API.Services.Implementations;
using BarbariBahar.API.Services.Interfaces;
using FluentValidation.AspNetCore;
using System.Reflection;
using BarbariBahar.API.Configurations;
using Microsoft.Extensions.Options;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// --- Serilog Configuration ---
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateBootstrapLogger();

builder.Host.UseSerilog((context, services, configuration) => configuration
    .ReadFrom.Configuration(context.Configuration)
    .ReadFrom.Services(services)
    .Enrich.FromLogContext());
// --- End Serilog Configuration ---

// Configure Settings
builder.Services.Configure<FarazSmsSettings>(
    builder.Configuration.GetSection(FarazSmsSettings.SectionName));
builder.Services.Configure<ZarinpalSettings>(
    builder.Configuration.GetSection(ZarinpalSettings.SectionName));

// Add services to the container.

// Database Configuration
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlite(builder.Configuration.GetConnectionString("SqliteConnection")));
}
else
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
}


// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]!)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ClockSkew = TimeSpan.Zero
        };

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
builder.Services.AddHttpClient("FarazSms", (serviceProvider, client) =>
{
    var smsSettings = serviceProvider.GetRequiredService<IOptions<FarazSmsSettings>>().Value;
    client.DefaultRequestHeaders.Add("Authorization", $"AccessKey {smsSettings.ApiKey}");
});

builder.Services.AddScoped<JwtHelper>();
builder.Services.AddScoped<IOtpService, OtpService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<IPricingService, PricingService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();

builder.Services.AddHttpClient("Zarinpal", (serviceProvider, client) =>
{
    var zarinpalSettings = serviceProvider.GetRequiredService<IOptions<ZarinpalSettings>>().Value;
    client.BaseAddress = new Uri(zarinpalSettings.IsSandbox
        ? "https://sandbox.zarinpal.com/pg/rest/WebGate/"
        : "https://api.zarinpal.com/pg/v4/payment/");
});

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
            .AllowCredentials();
    });
});

// AutoMapper
builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());

// FluentValidation
builder.Services.AddControllers()
    .AddFluentValidation(fv => fv.RegisterValidatorsFromAssembly(Assembly.GetExecutingAssembly()))
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    });


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Barbari Bahar API", Version = "v1" });

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

// --- Use Serilog Request Logging ---
app.UseSerilogRequestLogging();
// --- End Serilog ---

// Seed Data
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.Migrate();

    if (!context.ServiceCategories.Any())
    {
        var services = new[]
        {
            new ServiceCategory { Name = "اسباب‌کشی منزل", Slug = "home-moving", Description = "حمل کامل اثاثیه منزل", Order = 1, IsActive = true },
            new ServiceCategory { Name = "اسباب‌کشی اداری", Slug = "office-moving", Description = "حمل تجهیزات اداری", Order = 2, IsActive = true },
            new ServiceCategory { Name = "بارگیری و تخلیه", Slug = "loading-unloading", Description = "فقط بارگیری و تخلیه", Order = 3, IsActive = true }
        };
        context.ServiceCategories.AddRange(services);

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

app.UseMiddleware<ErrorHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<OrderTrackingHub>("/hubs/order-tracking");
app.MapHub<NotificationHub>("/hubs/notifications");

app.Run();
