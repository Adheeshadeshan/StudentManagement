using StudentManagement.Dal.Interfaces.Repositories;
namespace StudentManagement.Dal.Interfaces.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        /*
         * Property to access the student repository
         */
        IStudentRepository Students { get; }

        /*
         * Saves all changes in the current transaction to the database
         */
        Task<int> SaveChangesAsync();
    }
}
