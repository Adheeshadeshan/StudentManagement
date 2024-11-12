using StudentManagement.Domain.Models;
using StudentManagement.Dto.Business;
namespace StudentManagement.Dal.Interfaces.Repositories
{
    public interface IStudentRepository
    {
        Task<Student?> GetStudentByIdAsync(int id);
        Task<IEnumerable<Student>> GetAllStudentsAsync();
        Task AddStudentAsync(Student student);
        Task? UpdateStudentAsync(Student student);
        Task DeleteStudentAsync(int id);
    }
}
