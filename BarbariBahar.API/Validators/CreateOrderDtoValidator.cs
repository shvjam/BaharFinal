using FluentValidation;
using BarbariBahar.API.DTOs.Order;

namespace BarbariBahar.API.Validators
{
    public class CreateOrderDtoValidator : AbstractValidator<CreateOrderDto>
    {
        public CreateOrderDtoValidator()
        {
            RuleFor(x => x.CustomerPhone).NotEmpty().Matches(@"^09\d{9}$");
            RuleFor(x => x.ServiceCategoryId).NotEmpty();
            RuleFor(x => x.PreferredDateTime).NotEmpty();
            RuleFor(x => x.OriginAddress).NotEmpty().SetValidator(new CreateOrderAddressDtoValidator());
            RuleFor(x => x.DestinationAddress).NotEmpty().SetValidator(new CreateOrderAddressDtoValidator());
            RuleFor(x => x.DistanceKm).GreaterThan(0);
            RuleFor(x => x.Details).NotEmpty().SetValidator(new OrderDetailsDtoValidator());
            RuleForEach(x => x.Stops).SetValidator(new CreateOrderAddressDtoValidator());
            RuleForEach(x => x.Items).SetValidator(new CreateOrderItemDtoValidator());
        }
    }

    public class CreateOrderAddressDtoValidator : AbstractValidator<CreateOrderAddressDto>
    {
        public CreateOrderAddressDtoValidator()
        {
            RuleFor(x => x.FullAddress).NotEmpty().MaximumLength(500);
            RuleFor(x => x.Lat).NotEmpty();
            RuleFor(x => x.Lng).NotEmpty();
        }
    }

    public class OrderDetailsDtoValidator : AbstractValidator<OrderDetailsDto>
    {
        public OrderDetailsDtoValidator()
        {
            RuleFor(x => x.VehicleType).NotEmpty();
            RuleFor(x => x.WorkerCount).GreaterThanOrEqualTo(0);
        }
    }

    public class CreateOrderItemDtoValidator : AbstractValidator<CreateOrderItemDto>
    {
        public CreateOrderItemDtoValidator()
        {
            RuleFor(x => x.CatalogItemId).NotEmpty();
            RuleFor(x => x.Quantity).GreaterThan(0);
        }
    }
}
