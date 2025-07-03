using ComanyApp.Data;
using ComanyApp.Mapping;
using ComanyApp.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// --- 1. Регистрация сервисов ---
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAutoMapper(typeof(MappingProfile));
builder.Services.AddScoped<IEmployeeService, EmployeeService>();

var app = builder.Build();

// --- 2. Настройка конвейера обработки запросов ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseDefaultFiles(); // Для index.html
app.UseStaticFiles();  // Для css, js и других файлов

app.UseAuthorization();

app.MapControllers(); // Для нашего API

app.Run();