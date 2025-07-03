using AutoMapper;
using ComanyApp.Dto;

namespace ComanyApp.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // из Employee в EmployeeDto
        CreateMap<Employee, EmployeeDto>()
            .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DateOfBirth.ToString("yyyy-MM-dd")))
            .ForMember(dest => dest.DateOfEmployment, opt => opt.MapFrom(src => src.DateOfEmployment.ToString("yyyy-MM-dd")));

        // из EmployeeDto в Employee
        CreateMap<EmployeeDto, Employee>()
            .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => DateTime.Parse(src.DateOfBirth)))
            .ForMember(dest => dest.DateOfEmployment, opt => opt.MapFrom(src => DateTime.Parse(src.DateOfEmployment)));
    }
}