using AutoMapper;
using StudentManagement.Dal.Interfaces.UnitOfWork;
using StudentManagement.Domain.Models;
using StudentManagement.Dto.Business;

namespace StudentManagement.Service.Services
{
    public class StudentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public StudentService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        /*
         * Retrieves a student by their ID
         */
        public async Task<StudentDto> GetStudentByIdAsync(int id)
        {
            try
            {
                var student = await _unitOfWork.Students.GetStudentByIdAsync(id);
                return _mapper.Map<StudentDto>(student);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving student by ID: {ex.Message}");
                throw new Exception("An error occurred while retrieving the student.");
            }
        }

        /*
         * Retrieves all students from the database
         */
        public async Task<IEnumerable<StudentDto>> GetAllStudentsAsync()
        {
            try
            {
                var students = await _unitOfWork.Students.GetAllStudentsAsync();
                return _mapper.Map<IEnumerable<StudentDto>>(students);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving all students: {ex.Message}");
                throw new Exception("An error occurred while retrieving the students.");
            }
        }

        /*
         * Adds a new student to the database
         */
        public async Task AddStudentAsync(StudentDto studentDto)
        {
            try
            {
                var student = _mapper.Map<Student>(studentDto);
                await _unitOfWork.Students.AddStudentAsync(student);
                await _unitOfWork.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding student: {ex.Message}");
                throw new Exception("An error occurred while adding the student.");
            }
        }

        /*
         * Updates an existing student in the database
         */
        public async Task UpdateStudentAsync(StudentDto studentDto)
        {
            try
            {
                var student = _mapper.Map<Student>(studentDto);
                await _unitOfWork.Students.UpdateStudentAsync(student);
                await _unitOfWork.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating student: {ex.Message}");
                throw new Exception("An error occurred while updating the student.");
            }
        }

        /*
         * Deletes a student by their ID
         */
        public async Task DeleteStudentAsync(int id)
        {
            try
            {
                await _unitOfWork.Students.DeleteStudentAsync(id);
                await _unitOfWork.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting student: {ex.Message}");
                throw new Exception("An error occurred while deleting the student.");
            }
        }
    }
}
