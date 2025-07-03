using ComanyApp.Dto;

namespace ComanyApp.Services;

public interface IEmployeeService
{
    Task<IEnumerable<EmployeeDto>> GetAllEmployeesAsync();
    Task<EmployeeDto?> GetEmployeeByIdAsync(int id);
    Task<EmployeeDto> CreateEmployeeAsync(EmployeeDto employeeDto);
    Task<bool> UpdateEmployeeAsync(int id, EmployeeDto employeeDto);
    Task<bool> DeleteEmployeeAsync(int id);
}