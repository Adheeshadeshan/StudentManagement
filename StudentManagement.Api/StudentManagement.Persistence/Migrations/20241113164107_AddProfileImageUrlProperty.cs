using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentManagement.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddProfileImageUrlProperty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "NIC",
                table: "Students",
                newName: "Nic");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Nic",
                table: "Students",
                newName: "NIC");
        }
    }
}
