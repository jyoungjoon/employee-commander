const db = require('../config/db');
const inquirer = require('inquirer');
const { printTable } = require('console-table-printer');

process.stdin.setMaxListeners(20);

class EmployeeQueries {
  async viewAllEmployees() {
    const result = await db.query(
      `SELECT employees.id as Employee_ID, CONCAT(first_name, ' ', last_name) as Name, title as Title, department_name as Department, employees.salary as Salary, CASE WHEN manager_id IS NULL THEN 'N/A' ELSE CAST(manager_id AS CHAR) END as Manager_ID FROM employees LEFT JOIN positions ON employees.position_id = positions.id JOIN departments ON positions.department_id = departments.id ORDER BY employees.id asc`
    );
    return printTable(result);
  }

  async viewEmployeesByManager() {
    const managerData = await db.query(
      `SELECT id, CONCAT(first_name, ' ', last_name) as Name FROM employees`
    );
    const userInput = await inquirer.prompt([
      {
        name: 'manager_id',
        type: 'input',
        message: `What is the manager's Employee ID?`,
      },
    ]);
    const employeesByManager = await db.query(
      `SELECT employees.id as Employee_ID, CONCAT(first_name, ' ', last_name) as Name, title as Title, employees.salary as Salary FROM employees LEFT JOIN positions ON employees.position_id = positions.id JOIN departments ON positions.department_id = departments.id where manager_id = '${userInput.manager_id}' order by Salary desc`
    );

    if (employeesByManager.length === 0) {
      return console.log(
        `
  There are no employees managed by ${
    managerData.find((manager) => manager.id === userInput.manager_id * 1).Name
  } (Employee ID: ${userInput.manager_id})
        `
      );
    } else {
      console.log(
        `
  List of employees managed by ${
    managerData.find((manager) => manager.id === userInput.manager_id * 1).Name
  } (Employee ID: ${userInput.manager_id})`
      );
      printTable(employeesByManager);
    }
  }

  async addEmployee(newEmployee) {
    const positionData = await db.query(
      'SELECT id, title, salary FROM positions'
    );

    const positions = positionData.map((position) => position.title);

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
        name: 'position',
        type: 'list',
        message: 'What is the position of the new employee?',
        choices: [...positions],
      },
      {
        name: 'manager',
        type: 'input',
        message:
          'Do you wish to assign a manager to the new employee? Please enter Employee_ID of the manager or leave blank.',
      },
    ]);

    await db.query(
      'INSERT INTO employees (first_name, last_name, salary, position_id, manager_id) VALUES (?, ?, ?, ?, ?)',
      [
        userInput.first_name,
        userInput.last_name,
        userInput.salary,
        `${
          positionData.find((position) => position.title === userInput.position)
            .id
        }`,
        userInput.manager === '' ? null : userInput.manager,
      ]
    );

    const newRow = await db.query(
      `SELECT employees.id as Employee_ID, CONCAT(first_name, ' ', last_name) as Name, employees.salary as Salary, manager_id as Manager_ID, title as Title from employees JOIN positions on employees.position_id = positions.id where first_name = '${userInput.first_name}' AND last_name = '${userInput.last_name}'`
    );

    printTable(newRow);

    return console.log(
      `
  (New) Employee: ${userInput.first_name} ${userInput.last_name} has been added as ${userInput.position}!
      `
    );
  }

  async updateEmployee() {
    const positionData = await db.query(
      'SELECT id, title, salary FROM positions'
    );
    const positions = positionData.map((position) => position.title);
    const employeeData = await db.query(
      'SELECT id, position_id from employees'
    );
    const userInput = await inquirer.prompt([
      {
        name: 'employeeId',
        type: 'input',
        message: 'What is the Employee ID of the employee you wish to update?',
      },
      {
        name: 'newPosition',
        type: 'list',
        message:
          'Which (new) position do you wish to assign to the selected employee?',
        choices: [...positions],
      },
    ]);
    await db.query('UPDATE employees SET position_id = ? WHERE id = ?', [
      `${
        positionData.find(
          (position) => position.title === userInput.newPosition
        ).id
      }`,
      `${
        employeeData.find(
          (employee) => employee.id === userInput.employeeId * 1
        ).id
      }`,
    ]);
    const newRow = await db.query(
      `SELECT CONCAT(first_name, ' ', last_name) as Name, salary as Salary, manager_id as Manager_ID, position_id as Position_ID from employees where id = ${userInput.employeeId}`
    );
    printTable(newRow);
    return console.log(
      `(Update) Employee with Employee ID: (${userInput.employeeId}) has been assigned a new position: ${userInput.newPosition}.`
    );
  }

  async deleteEmployee() {
    const userInput = await inquirer.prompt([
      {
        name: 'fullName_id',
        type: 'input',
        message: `What is the full name and ID ('last name', 'first name', Employee ID) of the employee you wish to delete?`,
      },
      {
        name: 'finalCheck',
        type: 'confirm',
        message: `Delete the selected employee from the system? (CAUTION: This action is irreversible!)`,
      },
    ]);

    if (userInput.finalCheck) {
      await db.query(
        `DELETE FROM employees where first_name = '${
          userInput.fullName_id.split(', ')[1]
        }' AND last_name = '${userInput.fullName_id.split(', ')[0]}' AND id = ${
          userInput.fullName_id.split(', ')[2]
        }`
      );
      return console.log(
        `(Delete) Employee : ${userInput.fullName_id} has been deleted from the system successfully.`
      );
    }
  }

  async viewEmployeesByDepartment(departmentId) {
    const departmentData = await db.query(
      `SELECT department_name FROM departments`
    );
    const departmentNames = departmentData.map(
      (department) => department.department_name
    );

    const userInput = await inquirer.prompt([
      {
        name: 'department',
        type: 'list',
        message: `Which department's employees would you like to view?`,
        choices: [...departmentNames],
      },
    ]);
    const result = await db.query(
      `SELECT department_name as Department, employees.id as Employee_ID, CONCAT(first_name, ' ', last_name) as Name, title as Title, employees.salary as Salary FROM employees LEFT JOIN positions ON employees.position_id = positions.id JOIN departments ON positions.department_id = departments.id where department_name = '${userInput.department}' order by Salary desc`
    );
    return printTable(result);
  }
}

module.exports = EmployeeQueries;
