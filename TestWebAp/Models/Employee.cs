using System.ComponentModel.DataAnnotations;

namespace ComanyApp;

public class Employee
{
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Department { get; set; }

    [Required]
    [StringLength(150)]
    public string FullName { get; set; }

    [Required]
    public DateTime DateOfBirth { get; set; }

    [Required]
    public DateTime DateOfEmployment { get; set; }

    [Required]
    public decimal Salary { get; set; }
}