const db = require('../config/config');
const inquirer = require('inquirer');

class DatabaseQueries {
  constructor(db) {
    this.connection = db;
  }

  async viewAllDepartments() {
    const result = await db.query(
      'SELECT department_name as Departments FROM departments order by Departments asc'
    );
    return console.table(result);
  }

  async viewAllRoles() {
    const result = await db.query(
      'SELECT department_name as Department, title as Title, salary as Salary FROM roles RIGHT JOIN departments ON roles.department_id = departments.id ORDER BY salary desc'
    );
    return console.table(result);
  }

  async viewAllEmployees() {
    const result = await db.query('SELECT * FROM employees order by id asc');
    return console.table(result);
  }

  async addDepartment() {
    const userInput = await inquirer.prompt({
      name: 'department',
      type: 'input',
      message: 'What is the name of the new department?',
    });
    const result = await db.query(
      'INSERT INTO departments (department_name) VALUES (?)',
      [userInput.department]
    );
    return console.log(
      `(New) ${userInput.department} Department has been successfully added!`
    );
  }

  async addRole(newRole) {
    const departmentData = await db.query(
      'SELECT id, department_name FROM departments'
    );
    const departmentNames = departmentData.map(
      (department) => department.department_name
    );

    const userInput = await inquirer.prompt([
      {
        name: 'position',
        type: 'input',
        message: 'What is the title of the new position?',
      },
      {
        name: 'salary',
        type: 'input',
        message: 'What is the salary of the new position?',
      },
      {
        name: 'department',
        type: 'list',
        message: 'Which department should the new position be in?',
        choices: [...departmentNames],
      },
    ]);
    const result = await db.query(
      'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)',
      [
        userInput.position,
        userInput.salary,
        `${
          departmentData.find(
            (department) => department.department_name === userInput.department
          ).id
        }`,
      ]
    );
    return console.log(
      `(New) ${userInput.position} position has been successfully added!`
    );
  }

  async addEmployee(newEmployee) {
    const roleData = await db.query('SELECT id, title, salary FROM roles');

    const roles = roleData.map((role) => role.title);

    const userInput = await inquirer.prompt([
      {
        name: 'first_name',
        type: 'input',
        message: 'What is the first name of the new employee?',
      },
      {
        name: 'last_name',
        type: 'input',
        message: 'What is the last name of the new employee?',
      },
      {
        name: 'salary',
        type: 'input',
        message: 'What is the salary of the new employee?',
      },
      {
        name: 'role',
        type: 'list',
        message: 'What is the position of the new employee?',
        choices: [...roles],
      },
      {
        name: 'manager',
        type: 'list',
        message: 'Who is the manager (if any) of the new employee?',
        choices: [1],
      },
    ]);
    const result = await db.query(
      'INSERT INTO employees (first_name, last_name, salary, role_id, manager_id) VALUES (?, ?, ?, ?, ?)',
      [
        userInput.first_name,
        userInput.last_name,
        userInput.salary,
        `${roleData.find((role) => role.title === userInput.role).id}`,
        userInput.manager,
      ]
    );
    return console.log(
      `(New) Employee: ${userInput.first_name} ${userInput.last_name} has been added as ${userInput.role}!`
    );
  }

  async updateEmployeesRole() {
    const roleData = await db.query('SELECT id, title, salary FROM roles');
    const roles = roleData.map((role) => role.title);
    const employeeData = await db.query('SELECT id, role_id from employees');
    const userInput = await inquirer.prompt([
      {
        name: 'employeeId',
        type: 'input',
        message: 'What is the Employee ID of the employee you wish to update?',
      },
      {
        name: 'newRole',
        type: 'list',
        message:
          'Which (new) role do you wish to assign to the selected employee?',
        choices: [...roles],
      },
    ]);
    const result = await db.query(
      'UPDATE employees SET role_id = ? WHERE id = ?',
      [
        `${roleData.find((role) => role.title === userInput.newRole).id}`,
        `${
          employeeData.find(
            (employee) => employee.id === userInput.employeeId * 1
          ).id
        }`,
      ]
    );

    return console.log(
      `(Update) Employee with Employee ID: (${userInput.employeeId}) has been assigned a new role: ${userInput.newRole}.`
    );
  }

  updateManager(employeeId, managerId) {
    return this.db.query('SELECT * FROM employees');
  }
  viewEmployeesByManager(managerId) {
    return this.db.query(
      'SELECT * from employees WHERE manager_id = managerId'
    );
  }
  viewEmployeesByDepartment(departmentId) {
    return this.db.query(
      'SELECT * from employees WHERE department_id = departmentId'
    );
  }
  deleteDepartment(departmentId) {
    return this.db.query('DELETE from departments WHERE id = departmentId');
  }
  viewBudgetOfDepartment(departmentId) {
    return this.db.query('SELECT * from departments');
  }
}

module.exports = new DatabaseQueries(db);
