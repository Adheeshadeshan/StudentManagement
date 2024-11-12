namespace StudentManagement.Domain.Models
{
    public class Student
    {
        public int Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Mobile { get; set; }
        public string? Email { get; set; }
        public string? Nic { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string? Address { get; set; }
    }
}
