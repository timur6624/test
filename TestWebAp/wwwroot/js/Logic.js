document.addEventListener('DOMContentLoaded', () => {


    const navLinks = {
        about: document.getElementById('nav-about'),
        employees: document.getElementById('nav-employees'),
    };
    const pages = {
        about: document.getElementById('about-page'),
        employees: document.getElementById('employees-page'),
    };
    const employeesTableBody = document.getElementById('employees-table-body');
    const employeeForm = document.getElementById('employeeForm');


    const employeeModal = new bootstrap.Modal(document.getElementById('employeeModal'));
    const deleteConfirmModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));


    let currentSort = {
        column: 'id',
        direction: 'asc'
    };
    let employeeIdToDelete = null;


    function navigateTo(pageName) {

        Object.values(pages).forEach(page => page.classList.add('d-none'));

        Object.values(navLinks).forEach(link => link.classList.remove('active'));


        pages[pageName].classList.remove('d-none');
        navLinks[pageName].classList.add('active');

        if (pageName === 'employees') {
            loadEmployees();
        }
    }

    navLinks.about.addEventListener('click', (e) => { e.preventDefault(); navigateTo('about'); });
    navLinks.employees.addEventListener('click', (e) => { e.preventDefault(); navigateTo('employees'); });


    async function loadEmployees() {

        const filters = {};
        document.querySelectorAll('#filter-row input').forEach(input => {
            if (input.value) {
                filters[input.dataset.filter] = input.value;
            }
        });


        const queryParams = new URLSearchParams(filters);
        queryParams.append('sortBy', currentSort.column);
        queryParams.append('ascending', currentSort.direction === 'asc');

        const url = `/api/employees?${queryParams.toString()}`;


        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Ошибка сети: ${response.statusText}`);
            }
            const employees = await response.json();
            renderTable(employees);
        } catch (error) {
            console.error('Не удалось загрузить сотрудников:', error);
            employeesTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Ошибка загрузки данных.</td></tr>`;
        }
    }

    function renderTable(employees) {
        employeesTableBody.innerHTML = ''; 
        if (employees.length === 0) {
            employeesTableBody.innerHTML = `<tr><td colspan="6" class="text-center">Сотрудники не найдены.</td></tr>`;
            return;
        }

        employees.forEach(emp => {
            const row = `
                <tr data-id="${emp.id}">
                    <td>${emp.department}</td>
                    <td>${emp.fullName}</td>
                    <td>${new Date(emp.dateOfBirth).toLocaleDateString()}</td>
                    <td>${new Date(emp.dateOfEmployment).toLocaleDateString()}</td>
                    <td>${emp.salary.toLocaleString('ru-RU')} ₽</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary btn-edit">✏️</button>
                        <button class="btn btn-sm btn-outline-danger btn-delete">🗑️</button>
                    </td>
                </tr>
            `;
            employeesTableBody.insertAdjacentHTML('beforeend', row);
        });
    }
    
    document.getElementById('show-create-modal-btn').addEventListener('click', () => {
        employeeForm.reset();
        document.getElementById('employeeId').value = '';
        document.getElementById('employeeModalLabel').textContent = 'Добавить сотрудника';
        employeeModal.show();
    });


    employeeForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('employeeId').value;
        const employeeData = {
            id: id ? parseInt(id, 10) : 0,
            department: document.getElementById('department').value,
            fullName: document.getElementById('fullName').value,
            dateOfBirth: document.getElementById('dateOfBirth').value,
            dateOfEmployment: document.getElementById('dateOfEmployment').value,
            salary: parseFloat(document.getElementById('salary').value)
        };

        const isNew = !id;
        const url = isNew ? '/api/employees' : `/api/employees/${id}`;
        const method = isNew ? 'POST' : 'PUT';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(employeeData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData.errors || 'Ошибка сервера'));
            }

            employeeModal.hide();
            loadEmployees(); 
        } catch (error) {
            alert(`Ошибка сохранения: ${error.message}`);
        }
    });


    employeesTableBody.addEventListener('click', async (e) => {
        const target = e.target;
        const employeeId = target.closest('tr')?.dataset.id;
        if (!employeeId) return;


        if (target.classList.contains('btn-edit')) {
            const response = await fetch(`/api/employees/${employeeId}`);
            if (response.ok) {
                const emp = await response.json();
                document.getElementById('employeeId').value = emp.id;
                document.getElementById('department').value = emp.department;
                document.getElementById('fullName').value = emp.fullName;
                document.getElementById('dateOfBirth').value = emp.dateOfBirth;
                document.getElementById('dateOfEmployment').value = emp.dateOfEmployment;
                document.getElementById('salary').value = emp.salary;

                document.getElementById('employeeModalLabel').textContent = 'Редактировать сотрудника';
                employeeModal.show();
            } else {
                alert('Не удалось загрузить данные сотрудника.');
            }
        }

        if (target.classList.contains('btn-delete')) {
            employeeIdToDelete = employeeId;
            deleteConfirmModal.show();
        }
    });


    document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
        if (!employeeIdToDelete) return;

        const response = await fetch(`/api/employees/${employeeIdToDelete}`, { method: 'DELETE' });

        if (response.ok) {
            deleteConfirmModal.hide();
            loadEmployees();
        } else {
            alert('Ошибка при удалении сотрудника.');
        }
        employeeIdToDelete = null;
    });




    document.getElementById('apply-filters-btn').addEventListener('click', loadEmployees);


    document.querySelector('thead').addEventListener('click', (e) => {
        const header = e.target.closest('th[data-sortby]');
        if (!header) return;

        const sortBy = header.dataset.sortby;

        if (currentSort.column === sortBy) {

            currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {

            currentSort.column = sortBy;
            currentSort.direction = 'asc';
        }


        document.querySelectorAll('thead th').forEach(th => th.classList.remove('sort-asc', 'sort-desc'));

        header.classList.add(`sort-${currentSort.direction}`);

        loadEmployees();
    });
    
    navigateTo('about');
});