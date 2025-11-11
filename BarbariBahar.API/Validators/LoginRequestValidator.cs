using FluentValidation;
using BarbariBahar.API.DTOs.Auth;

namespace BarbariBahar.API.Validators
{
    public class LoginRequestValidator : AbstractValidator<LoginRequestDto>
    {
        public LoginRequestValidator()
        {
            RuleFor(x => x.PhoneNumber)
                .NotEmpty().WithMessage("شماره تلفن الزامی است.")
                .Matches(@"^09\d{9}$").WithMessage("فرمت شماره تلفن صحیح نیست.");

            RuleFor(x => x.Otp)
                .NotEmpty().WithMessage("کد تایید الزامی است.")
                .Length(4).WithMessage("کد تایید باید 4 رقم باشد.");
        }
    }
}
