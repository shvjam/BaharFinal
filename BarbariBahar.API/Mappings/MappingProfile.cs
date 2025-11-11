using AutoMapper;
using BarbariBahar.API.DTOs.Order;
using BarbariBahar.API.Models;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace BarbariBahar.API.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Order to OrderResponseDto Mapping
            CreateMap<Order, OrderResponseDto>()
                .ForMember(dest => dest.Details, opt => opt.MapFrom(src => JsonConvert.DeserializeObject<OrderDetailsDto>(src.DetailsJson)))
                .ForMember(dest => dest.OriginAddress, opt => opt.MapFrom(src => JsonConvert.DeserializeObject<CreateOrderAddressDto>(src.OriginAddressJson)))
                .ForMember(dest => dest.DestinationAddress, opt => opt.MapFrom(src => JsonConvert.DeserializeObject<CreateOrderAddressDto>(src.DestinationAddressJson)))
                .ForMember(dest => dest.Stops, opt => opt.MapFrom(src => src.StopsJson != null ? JsonConvert.DeserializeObject<List<CreateOrderAddressDto>>(src.StopsJson) : null));

            // PackingService to PackingServiceResponseDto Mapping
            CreateMap<PackingService, PackingServiceResponseDto>()
                .ForMember(dest => dest.PackingItems, opt => opt.MapFrom(src => src.PackingItemsJson != null ? JsonConvert.DeserializeObject(src.PackingItemsJson) : null))
                .ForMember(dest => dest.PackingProducts, opt => opt.MapFrom(src => src.PackingProductsJson != null ? JsonConvert.DeserializeObject(src.PackingProductsJson) : null));

            // Driver to DriverResponseDto Mapping
            CreateMap<Driver, DriverResponseDto>()
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.User.PhoneNumber))
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.User.FullName))
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.User.Role))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.User.CreatedAt))
                .ForMember(dest => dest.CurrentLocation, opt => opt.MapFrom(src =>
                    (src.CurrentLat.HasValue && src.CurrentLng.HasValue)
                    ? new DTOs.Driver.LocationDto { Lat = src.CurrentLat.Value, Lng = src.CurrentLng.Value }
                    : null));
        }
    }
}
