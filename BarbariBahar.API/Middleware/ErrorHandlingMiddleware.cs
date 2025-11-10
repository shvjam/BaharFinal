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