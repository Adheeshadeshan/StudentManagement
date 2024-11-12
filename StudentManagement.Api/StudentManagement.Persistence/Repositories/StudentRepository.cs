using Microsoft.EntityFrameworkCore;
using StudentManagement.Dal.Interfaces.Repositories;
using StudentManagement.Domain.Models;
using StudentManagement.Persistence.Context;

namespace StudentManagement.Persistence.Repositories
{
    public class StudentRepository : IStudentRepository
    {
        private readonly StudentDbContext _context;

        public StudentRepository(StudentDbContext context)
        {
            _context = context;
        }

        /*
         * Retrieves a student by their ID
         */
        public async Task<Student?> GetStudentByIdAsync(int id)
        {
            try
            {
                return await _context.Students.FindAsync(id);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving student by ID: {ex.Message}");
                throw new Exception("An error occurred while retrieving the student.");
            }
        }

        /*
         * Retrieves all students in the database
         */
        public async Task<IEnumerable<Student>> GetAllStudentsAsync()
        {
            try
            {
                return await _context.Students.ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving all students: {ex.Message}");
                throw new Exception("An error occurred while retrieving students.");
            }
        }

        /*
         * Adds a new student to the database
         */
        public async Task AddStudentAsync(Student student)
        {
            try
            {
                await _context.Students.AddAsync(student);
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
        public async Task UpdateStudentAsync(Student student)
        {
            try
            {
                _context.Students.Update(student);
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
                var student = await GetStudentByIdAsync(id);
                if (student != null)
                {
                    _context.Students.Remove(student);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting student: {ex.Message}");
                throw new Exception("An error occurred while deleting the student.");
            }
        }
    }
}
