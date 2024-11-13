using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentManagement.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ProfileImageUrlProperty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProfileImageUrl",
                table: "Students",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfileImageUrl",
                table: "Students");
        }
    }
}
