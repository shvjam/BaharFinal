using System.Text.Json.Serialization;

namespace BarbariBahar.API.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum UserRole
    {
        GUEST,
        CUSTOMER,
        DRIVER,
        ADMIN
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum OrderStatus
    {
        DRAFT,
        PENDING,
        REVIEWING,
        CONFIRMED,
        DRIVER_ASSIGNED,
        DRIVER_EN_ROUTE_TO_ORIGIN,
        PACKING_IN_PROGRESS,
        LOADING_IN_PROGRESS,
        IN_TRANSIT,
        ARRIVED_AT_DESTINATION,
        COMPLETED,
        CANCELLED
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum VehicleType
    {
        PICKUP,    // وانت
        NISSAN,    // نیسان
        TRUCK,     // کامیون
        HEAVY_TRUCK // خاور
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum PackingType
    {
        FULL,         // بسته‌بندی تمام لوازم منزل
        LARGE_ITEMS,  // لوازم بزرگ
        SMALL_ITEMS,  // خرده‌ریزها
        OFFICE        // لوازم اداری
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum PaymentStatus
    {
        PENDING,
        PAID,
        FAILED,
        REFUNDED
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum PaymentMethod
    {
        ONLINE,
        CASH,
        WALLET
    }
}