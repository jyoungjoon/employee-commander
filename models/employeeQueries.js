const db = require('../config/db');
const inquirer = require('inquirer');
const { printTable } = require('console-table-printer');
const validator = require('validator');

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
        validate: (manager_id) => {
          if (validator.isNumeric(manager_id)) {
            return true;
          } else {
            return 'Please enter a valid Employee ID (numbers only)';
          }
        },
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
        validate: (first_name) => {
          if (!validator.isEmpty(first_name) && validator.isAlpha(first_name)) {
            return true;
          } else {
            return 'Please enter a valid first name (letters only)';
          }
        },
      },
      {
        name: 'last_name',
        type: 'input',
        message: 'What is the last name of the new employee?',
        validate: (last_name) => {
          if (!validator.isEmpty(last_name) && validator.isAlpha(last_name)) {
            return true;
          } else {
            return 'Please enter a valid last name (letters only)';
          }
        },
      },
      {
        name: 'salary',
        type: 'input',
        message: 'What is the salary of the new employee?',
        validate: (salary) => {
          if (validator.isNumeric(salary)) {
            return true;
          } else {
            return 'Please enter a valid salary (numbers only)';
          }
        },
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
          'What is the Employee ID of the manager of the new employee? (Leave blank if none)',
        validate: (manager) => {
          if (manager === '') {
            return true;
          } else if (validator.isNumeric(manager)) {
            return true;
          } else {
            return 'Please enter a valid Employee ID (numbers only)';
          }
        },
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
        validate: (employeeId) => {
          if (validator.isNumeric(employeeId)) {
            return true;
          } else {
            return 'Please enter a valid Employee ID (numbers only)';
          }
        },
      },
      {
        name: 'newPosition',
        type: 'list',
        message:
          'What is the new position of the employee?',
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
        message: `What is the full name and ID of the employee you wish to delete? \n  Must be in the format: 'last name', 'first name', Employee ID (e.g. Doe, John, 1)`,
        validate: (fullName_id) => {
          if (
            validator.isAlpha(fullName_id.split(', ')[0]) &&
            validator.isAlpha(fullName_id.split(', ')[1]) &&
            validator.isNumeric(fullName_id.split(', ')[2])
          ) {
            return true;
          } else {
            return `Must be in the format: 'last name', 'first name', Employee ID (e.g. Doe, John, 1)`;
          }
        },
      },
    ]);

    const employeeData = await db.query(
      `SELECT CONCAT(first_name, ' ', last_name) as Name, id as Employee_ID from employees where first_name = '${
        userInput.fullName_id.split(', ')[1]
      }' AND last_name = '${userInput.fullName_id.split(', ')[0]}' AND id = ${
        userInput.fullName_id.split(', ')[2]
      }`
    );

    if (employeeData.length > 0) {
      const { Name, Employee_ID } = employeeData[0];
      const userConfirmation = await inquirer.prompt([
        {
          name: 'finalCheck',
          type: 'confirm',
          message: `Are you sure you want to delete Employee: ${Name} (Employee ID: ${Employee_ID})?`,
          default: false,
        },
      ]);

      if (userConfirmation.finalCheck) {
        await db.query(
          `DELETE FROM employees where first_name = '${
            userInput.fullName_id.split(', ')[1]
          }' AND last_name = '${
            userInput.fullName_id.split(', ')[0]
          }' AND id = ${userInput.fullName_id.split(', ')[2]}`
        );
        return console.log(
          `(Delete) Employee : ${Name} (Employee ID: ${Employee_ID}) has been deleted from the system successfully.`
        );
      }
    } else {
      console.log(
        `Employee: ${userInput.fullName_id} does not exist. Please make sure you entered the correct name and ID.`
      );
    }
  }
  
  async viewEmployeesByDepartment() {
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
