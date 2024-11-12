using AutoMapper;
using StudentManagement.Domain.Models;
using StudentManagement.Dto.Business;

namespace StudentManagement.Service.Mappings
{
    /*
     * AutoMapper profile to configure mappings between Student and StudentDto
     */
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Student, StudentDto>().ReverseMap();
        }
    }
}
