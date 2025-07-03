using AutoMapper;
using ComanyApp.Data;
using ComanyApp.Dto;
using Microsoft.EntityFrameworkCore;

namespace ComanyApp.Services;

public class EmployeeService : IEmployeeService
{
    private readonly ApplicationDbContext _context; 
        private readonly IMapper _mapper; 

        public EmployeeService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<EmployeeDto>> GetAllEmployeesAsync()
        {
            var employees = await _context.Employees.AsNoTracking().ToListAsync();
            return _mapper.Map<IEnumerable<EmployeeDto>>(employees);
        }

        public async Task<EmployeeDto?> GetEmployeeByIdAsync(int id)
        {
            var employee = await _context.Employees.AsNoTracking().FirstOrDefaultAsync(e => e.Id == id);
            if (employee == null) return null;
            
            return _mapper.Map<EmployeeDto>(employee);
        }

        public async Task<EmployeeDto> CreateEmployeeAsync(EmployeeDto employeeDto)
        {
            var employee = _mapper.Map<Employee>(employeeDto);
            
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
            

            return _mapper.Map<EmployeeDto>(employee);
        }

        public async Task<bool> UpdateEmployeeAsync(int id, EmployeeDto employeeDto)
        {
            var employeeToUpdate = await _context.Employees.FindAsync(id);

            if (employeeToUpdate == null)
            {
                return false; 
            }

      
            _mapper.Map(employeeDto, employeeToUpdate);

            _context.Entry(employeeToUpdate).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            
            return true;
        }

        public async Task<bool> DeleteEmployeeAsync(int id)
        {
            var employeeToDelete = await _context.Employees.FindAsync(id);

            if (employeeToDelete == null)
            {
                return false;
            }

            _context.Employees.Remove(employeeToDelete);
            await _context.SaveChangesAsync();

            return true;
        }
    }