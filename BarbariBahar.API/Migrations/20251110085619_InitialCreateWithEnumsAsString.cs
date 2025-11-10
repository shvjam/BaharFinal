using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BarbariBahar.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreateWithEnumsAsString : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CatalogCategories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Slug = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    Order = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CatalogCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DiscountCodes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Code = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Type = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    Value = table.Column<decimal>(type: "TEXT", nullable: false),
                    MaxDiscount = table.Column<decimal>(type: "TEXT", nullable: true),
                    MinOrderAmount = table.Column<decimal>(type: "TEXT", nullable: true),
                    StartDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    EndDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    UsageLimit = table.Column<int>(type: "INTEGER", nullable: true),
                    UsageCount = table.Column<int>(type: "INTEGER", nullable: false),
                    PerUserLimit = table.Column<int>(type: "INTEGER", nullable: true),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiscountCodes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PackingProducts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    Price = table.Column<decimal>(type: "TEXT", nullable: false),
                    Unit = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Image = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    Stock = table.Column<int>(type: "INTEGER", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PackingProducts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PricingConfigs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    BaseWorkerRate = table.Column<decimal>(type: "TEXT", nullable: false),
                    BaseVehicleRatesJson = table.Column<string>(type: "TEXT", nullable: false),
                    PerKmRate = table.Column<decimal>(type: "TEXT", nullable: false),
                    PerFloorRate = table.Column<decimal>(type: "TEXT", nullable: false),
                    WalkingDistanceRatesJson = table.Column<string>(type: "TEXT", nullable: false),
                    StopRate = table.Column<decimal>(type: "TEXT", nullable: false),
                    PackingHourlyRate = table.Column<decimal>(type: "TEXT", nullable: false),
                    CancellationFee = table.Column<decimal>(type: "TEXT", nullable: false),
                    ExpertVisitFee = table.Column<decimal>(type: "TEXT", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PricingConfigs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ServiceCategories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Slug = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    Icon = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    Order = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    PhoneNumber = table.Column<string>(type: "TEXT", maxLength: 11, nullable: false),
                    FullName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    Role = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CatalogItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    CategoryId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    BasePrice = table.Column<decimal>(type: "TEXT", nullable: false),
                    Unit = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    Order = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CatalogItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CatalogItems_CatalogCategories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "CatalogCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Addresses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Title = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    FullAddress = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    Lat = table.Column<double>(type: "REAL", nullable: false),
                    Lng = table.Column<double>(type: "REAL", nullable: false),
                    District = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    City = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Province = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    PostalCode = table.Column<string>(type: "TEXT", maxLength: 10, nullable: true),
                    Details = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Addresses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Addresses_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Drivers",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    NationalId = table.Column<string>(type: "TEXT", maxLength: 10, nullable: true),
                    DateOfBirth = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Address = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    LicensePlate = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    VehicleType = table.Column<string>(type: "TEXT", nullable: false),
                    VehicleModel = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    VehicleColor = table.Column<string>(type: "TEXT", maxLength: 30, nullable: true),
                    VehicleYear = table.Column<int>(type: "INTEGER", nullable: true),
                    AvailableWorkers = table.Column<int>(type: "INTEGER", nullable: false),
                    DriverLicenseNumber = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    DriverLicenseExpiry = table.Column<DateTime>(type: "TEXT", nullable: true),
                    DriverLicenseImage = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    VehicleCardImage = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    InsuranceImage = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    ProfileImage = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    DocumentsVerified = table.Column<bool>(type: "INTEGER", nullable: false),
                    VerifiedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Sheba = table.Column<string>(type: "TEXT", maxLength: 24, nullable: true),
                    Rating = table.Column<double>(type: "REAL", nullable: false),
                    TotalRides = table.Column<int>(type: "INTEGER", nullable: false),
                    CompletedRides = table.Column<int>(type: "INTEGER", nullable: false),
                    CancelledRides = table.Column<int>(type: "INTEGER", nullable: false),
                    TotalEarnings = table.Column<decimal>(type: "TEXT", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsOnline = table.Column<bool>(type: "INTEGER", nullable: false),
                    CommissionPercentage = table.Column<double>(type: "REAL", nullable: false),
                    Priority = table.Column<int>(type: "INTEGER", nullable: false),
                    CurrentLat = table.Column<double>(type: "REAL", nullable: true),
                    CurrentLng = table.Column<double>(type: "REAL", nullable: true),
                    LastLocationUpdate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    AdminNote = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Drivers", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_Drivers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Type = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    Title = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Message = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: false),
                    IsRead = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DataJson = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notifications_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    CustomerId = table.Column<Guid>(type: "TEXT", nullable: true),
                    CustomerPhone = table.Column<string>(type: "TEXT", maxLength: 11, nullable: false),
                    CustomerName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    ServiceCategoryId = table.Column<Guid>(type: "TEXT", nullable: false),
                    DriverId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    PreferredDateTime = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ConfirmedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    StartedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    EstimatedPrice = table.Column<decimal>(type: "TEXT", nullable: false),
                    FinalPrice = table.Column<decimal>(type: "TEXT", nullable: true),
                    DiscountCode = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    DiscountAmount = table.Column<decimal>(type: "TEXT", nullable: true),
                    DetailsJson = table.Column<string>(type: "TEXT", nullable: false),
                    OriginAddressJson = table.Column<string>(type: "TEXT", nullable: false),
                    DestinationAddressJson = table.Column<string>(type: "TEXT", nullable: false),
                    StopsJson = table.Column<string>(type: "TEXT", nullable: true),
                    DistanceKm = table.Column<double>(type: "REAL", nullable: false),
                    EstimatedDuration = table.Column<int>(type: "INTEGER", nullable: false),
                    CustomerNote = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true),
                    AdminNote = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true),
                    DriverNote = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true),
                    Rating = table.Column<double>(type: "REAL", nullable: true),
                    Review = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true),
                    CancellationReason = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    CancellationFee = table.Column<decimal>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Orders_ServiceCategories_ServiceCategoryId",
                        column: x => x.ServiceCategoryId,
                        principalTable: "ServiceCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Orders_Users_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "LocationUpdates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    DriverId = table.Column<Guid>(type: "TEXT", nullable: false),
                    OrderId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Lat = table.Column<double>(type: "REAL", nullable: false),
                    Lng = table.Column<double>(type: "REAL", nullable: false),
                    Heading = table.Column<double>(type: "REAL", nullable: true),
                    Speed = table.Column<double>(type: "REAL", nullable: true),
                    Accuracy = table.Column<double>(type: "REAL", nullable: true),
                    Timestamp = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LocationUpdates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LocationUpdates_Drivers_DriverId",
                        column: x => x.DriverId,
                        principalTable: "Drivers",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DriverAssignments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    OrderId = table.Column<Guid>(type: "TEXT", nullable: false),
                    DriverId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Commission = table.Column<double>(type: "REAL", nullable: false),
                    CommissionAmount = table.Column<decimal>(type: "TEXT", nullable: true),
                    Note = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    AssignedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    AcceptedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    RejectedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    RejectionReason = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DriverAssignments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DriverAssignments_Drivers_DriverId",
                        column: x => x.DriverId,
                        principalTable: "Drivers",
                        principalColumn: "UserId");
                    table.ForeignKey(
                        name: "FK_DriverAssignments_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "LocationDetails",
                columns: table => new
                {
                    OrderId = table.Column<Guid>(type: "TEXT", nullable: false),
                    OriginFloor = table.Column<int>(type: "INTEGER", nullable: false),
                    OriginHasElevator = table.Column<bool>(type: "INTEGER", nullable: false),
                    DestinationFloor = table.Column<int>(type: "INTEGER", nullable: false),
                    DestinationHasElevator = table.Column<bool>(type: "INTEGER", nullable: false),
                    WalkDistanceMeters = table.Column<int>(type: "INTEGER", nullable: false),
                    StopCount = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LocationDetails", x => x.OrderId);
                    table.ForeignKey(
                        name: "FK_LocationDetails_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    OrderId = table.Column<Guid>(type: "TEXT", nullable: false),
                    CatalogItemId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Quantity = table.Column<int>(type: "INTEGER", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "TEXT", nullable: false),
                    TotalPrice = table.Column<decimal>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderItems_CatalogItems_CatalogItemId",
                        column: x => x.CatalogItemId,
                        principalTable: "CatalogItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderItems_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PackingServices",
                columns: table => new
                {
                    OrderId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Type = table.Column<string>(type: "TEXT", nullable: false),
                    MaleWorkers = table.Column<int>(type: "INTEGER", nullable: false),
                    FemaleWorkers = table.Column<int>(type: "INTEGER", nullable: false),
                    EstimatedHours = table.Column<int>(type: "INTEGER", nullable: false),
                    NeedsMaterials = table.Column<bool>(type: "INTEGER", nullable: false),
                    MaterialsMode = table.Column<string>(type: "TEXT", maxLength: 20, nullable: true),
                    PackingItemsJson = table.Column<string>(type: "TEXT", nullable: true),
                    PackingProductsJson = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PackingServices", x => x.OrderId);
                    table.ForeignKey(
                        name: "FK_PackingServices_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    OrderId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Amount = table.Column<decimal>(type: "TEXT", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    Method = table.Column<string>(type: "TEXT", nullable: false),
                    GatewayTransactionId = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    GatewayResponseJson = table.Column<string>(type: "TEXT", nullable: true),
                    PaidAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    RefundedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Payments_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_UserId",
                table: "Addresses",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_CatalogItems_CategoryId",
                table: "CatalogItems",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_DiscountCodes_Code",
                table: "DiscountCodes",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DriverAssignments_DriverId",
                table: "DriverAssignments",
                column: "DriverId");

            migrationBuilder.CreateIndex(
                name: "IX_DriverAssignments_OrderId",
                table: "DriverAssignments",
                column: "OrderId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LocationUpdates_DriverId",
                table: "LocationUpdates",
                column: "DriverId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_UserId",
                table: "Notifications",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_CatalogItemId",
                table: "OrderItems",
                column: "CatalogItemId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_OrderId",
                table: "OrderItems",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_CustomerId",
                table: "Orders",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_CustomerPhone",
                table: "Orders",
                column: "CustomerPhone");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_ServiceCategoryId",
                table: "Orders",
                column: "ServiceCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_Status",
                table: "Orders",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_OrderId",
                table: "Payments",
                column: "OrderId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_PhoneNumber",
                table: "Users",
                column: "PhoneNumber",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Addresses");

            migrationBuilder.DropTable(
                name: "DiscountCodes");

            migrationBuilder.DropTable(
                name: "DriverAssignments");

            migrationBuilder.DropTable(
                name: "LocationDetails");

            migrationBuilder.DropTable(
                name: "LocationUpdates");

            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.DropTable(
                name: "OrderItems");

            migrationBuilder.DropTable(
                name: "PackingProducts");

            migrationBuilder.DropTable(
                name: "PackingServices");

            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropTable(
                name: "PricingConfigs");

            migrationBuilder.DropTable(
                name: "Drivers");

            migrationBuilder.DropTable(
                name: "CatalogItems");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "CatalogCategories");

            migrationBuilder.DropTable(
                name: "ServiceCategories");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
