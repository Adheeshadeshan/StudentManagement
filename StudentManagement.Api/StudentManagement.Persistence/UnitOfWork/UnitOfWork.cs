using StudentManagement.Dal.Interfaces.Repositories;
using StudentManagement.Dal.Interfaces.UnitOfWork;
using StudentManagement.Persistence.Context;
using StudentManagement.Persistence.Repositories;

namespace StudentManagement.Persistence.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly StudentDbContext _context;
        private IStudentRepository _studentRepository;

        public UnitOfWork(StudentDbContext context)
        {
            _context = context;
        }

        /*
         * Property to access the student repository
         */
        public IStudentRepository Students => _studentRepository ??= new StudentRepository(_context);

        /*
         * Saves changes in the current transaction to the database
         */
        public async Task<int> SaveChangesAsync()
        {
            try
            {
                return await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving changes: {ex.Message}");
                throw new Exception("An error occurred while saving changes to the database.");
            }
        }

        /*
         * Disposes of the context to release database connections
         */
        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
