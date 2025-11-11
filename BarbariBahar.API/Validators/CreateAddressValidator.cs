using FluentValidation;
using BarbariBahar.API.DTOs.User;

namespace BarbariBahar.API.Validators
{
    public class CreateAddressValidator : AbstractValidator<CreateAddressDto>
    {
        public CreateAddressValidator()
        {
            RuleFor(x => x.Title).NotEmpty().MaximumLength(50);
            RuleFor(x => x.FullAddress).NotEmpty().MaximumLength(500);
            RuleFor(x => x.Lat).NotEmpty();
            RuleFor(x => x.Lng).NotEmpty();
            RuleFor(x => x.District).NotEmpty().MaximumLength(50);
            RuleFor(x => x.City).NotEmpty().MaximumLength(50);
            RuleFor(x => x.Province).NotEmpty().MaximumLength(50);
            RuleFor(x => x.PostalCode).MaximumLength(10);
            RuleFor(x => x.Details).MaximumLength(500);
        }
    }
}
