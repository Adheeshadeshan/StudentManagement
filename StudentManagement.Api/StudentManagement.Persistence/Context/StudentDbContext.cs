using Microsoft.EntityFrameworkCore;
using StudentManagement.Domain.Models;

namespace StudentManagement.Persistence.Context
{
    public class StudentDbContext : DbContext
    {
        public StudentDbContext(DbContextOptions<StudentDbContext> options) : base(options) { }

        public DbSet<Student> Students { get; set; }
    }
}
