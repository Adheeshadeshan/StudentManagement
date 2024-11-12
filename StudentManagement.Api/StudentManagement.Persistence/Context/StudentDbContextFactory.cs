using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace StudentManagement.Persistence.Context
{
    public class StudentDbContextFactory : IDesignTimeDbContextFactory<StudentDbContext>
    {
        public StudentDbContext CreateDbContext(string[] args)
        {
            // Locate the appsettings.json file in the root project
            var path = Path.Combine(Directory.GetParent(Directory.GetCurrentDirectory()).FullName, "StudentManagement.Api");

            // Build configuration
            var configuration = new ConfigurationBuilder()
                .SetBasePath(path)  // Set the base path to the main project directory
                .AddJsonFile("appsettings.json")
                .Build();

            // Configure DbContextOptions with connection string from configuration
            var optionsBuilder = new DbContextOptionsBuilder<StudentDbContext>();
            optionsBuilder.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));

            return new StudentDbContext(optionsBuilder.Options);
        }
    }
}
