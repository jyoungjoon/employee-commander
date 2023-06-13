const db = require('../config/db');
const inquirer = require('inquirer');
const validator = require('validator');

class EmployeeQueries {
  async query(sql, params) {
    try {
      return await db.query(sql, params);
    } catch (err) {
      console.error('Database query error:', err.message);
    }
  }

  async getAllEmployees() {
    const sql = `SELECT employees.id as Employee_ID, CONCAT(first_name, ' ', last_name) as Name, title as Title, department_name as Department, employees.salary as Salary, CASE WHEN manager_id IS NULL THEN 'N/A' ELSE CAST(manager_id AS CHAR) END as Manager_ID FROM employees LEFT JOIN positions ON employees.position_id = positions.id JOIN departments ON positions.department_id = departments.id ORDER BY employees.id asc`;
    return await this.query(sql);
  }

  async getEmployeesByDepartment() {
    const sql = `SELECT department_name FROM departments`;
    const departmentData = await this.query(sql);
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

    const employeesSql = `SELECT employees.id as Employee_ID, CONCAT(first_name, ' ', last_name) as Name, title as Title, employees.salary as Salary FROM employees LEFT JOIN positions ON employees.position_id = positions.id JOIN departments ON positions.department_id = departments.id where department_name = ? order by Salary desc`;
    const employeesByDepartment = await this.query(
      employeesSql,
      userInput.department
    );

    return employeesByDepartment;
  }

  async getEmployeesByManager() {
    const sql = `SELECT id, CONCAT(first_name, ' ', last_name) as Name FROM employees`;
    const managerData = await this.query(sql);

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

    const employeesSql = `SELECT employees.id as Employee_ID, CONCAT(first_name, ' ', last_name) as Name, title as Title, employees.salary as Salary FROM employees LEFT JOIN positions ON employees.position_id = positions.id JOIN departments ON positions.department_id = departments.id where manager_id = ? order by Salary desc`;
    const employeesSqlParams = userInput.manager_id;

    const employeesByManager = await this.query(
      employeesSql,
      employeesSqlParams
    );

    if (employeesByManager.length === 0) {
      return console.log(
        `** There are no employees managed by ${
          managerData.find((manager) => manager.id === userInput.manager_id * 1)
            .Name
        } (Employee ID: ${userInput.manager_id})`
      );
    } else {
      console.log(
        `
  List of employees managed by ${
    managerData.find((manager) => manager.id === userInput.manager_id * 1).Name
  } (Employee ID: ${userInput.manager_id})`
      );
      return employeesByManager;
    }
  }

  async addNewEmployee() {
    const sql = 'SELECT id, title, salary FROM positions';
    const positionData = await this.query(sql);
    const positionTitles = positionData.map((position) => position.title);

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
        choices: [...positionTitles],
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

    const addEmployeeSql = `INSERT INTO employees (first_name, last_name, salary, position_id, manager_id) VALUES (?, ?, ?, ?, ?)`;
    const addEmployeeSqlParams = [
      userInput.first_name,
      userInput.last_name,
      userInput.salary,
      `${
        positionData.find((position) => position.title === userInput.position)
          .id
      }`,
      userInput.manager === '' ? null : userInput.manager,
    ];

    const addEmployee = await this.query(addEmployeeSql, addEmployeeSqlParams);

    const newEmployeeRowSql = `SELECT employees.id as Employee_ID, CONCAT(first_name, ' ', last_name) as Name, employees.salary as Salary, manager_id as Manager_ID, title as Title from employees JOIN positions on employees.position_id = positions.id where first_name = ? AND last_name = ?`;
    const newEmployeeRowSqlParams = [userInput.first_name, userInput.last_name];
    const newEmployeeRow = await this.query(
      newEmployeeRowSql,
      newEmployeeRowSqlParams
    );

    const newEmployee = {
      data: newEmployeeRow,
      message: `** (New) Employee: ${userInput.first_name} ${userInput.last_name} has been added as ${userInput.position}!`,
    };

    return newEmployee;
  }

  async updateEmployeePosition() {
    const sql = 'SELECT id, title, salary FROM positions';
    const positionData = await this.query(sql);
    const positionTitles = await positionData.map((position) => position.title);

    const employeeSql = 'SELECT id, position_id from employees';
    const employeeData = await this.query(employeeSql);

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
        message: 'What is the new position of the employee?',
        choices: [...positionTitles],
      },
    ]);

    const updateEmployeeSql = `UPDATE employees SET position_id = ? WHERE id = ?`;
    const updateEmployeeSqlParams = [
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
    ];

    await this.query(updateEmployeeSql, updateEmployeeSqlParams);

    const updatedEmployeeRowSql = `SELECT CONCAT(first_name, ' ', last_name) as Name, salary as Salary, manager_id as Manager_ID, position_id as Position_ID from employees where id = ?`;
    const updatedEmployeeRow = await this.query(
      updatedEmployeeRowSql,
      userInput.employeeId
    );

    const updatedEmployee = {
      data: updatedEmployeeRow,
      message: `** (Update) Employee with Employee ID: (${userInput.employeeId}) has been assigned a new position: ${userInput.newPosition}.`,
    };

    return updatedEmployee;
  }

  async updateEmployeeManager() {
    const userInput = await inquirer.prompt([
      {
        name: 'employeeId',
        type: 'input',
        message:
          'What is the Employee ID of the employee you wish to update the manager for?',
        validate: (employeeId) => {
          if (validator.isNumeric(employeeId)) {
            return true;
          } else {
            return 'Please enter a valid Employee ID (numbers only)';
          }
        },
      },
      {
        name: 'managerId',
        type: 'input',
        message: 'What is the Employee ID of the new manager?',
        validate: (managerId) => {
          if (validator.isNumeric(managerId)) {
            return true;
          } else {
            return 'Please enter a valid Employee ID (numbers only)';
          }
        },
      },
    ]);

    const updateManagerSql = `UPDATE employees SET manager_id = ? WHERE id = ?`;
    const updateManagerSqlParams = [userInput.managerId, userInput.employeeId];

    await this.query(updateManagerSql, updateManagerSqlParams);

    const updatedEmployeeRowSql = `SELECT CONCAT(first_name, ' ', last_name) as Name, manager_id as Manager_ID from employees where id = ?`;
    const updatedEmployeeRow = await this.query(
      updatedEmployeeRowSql,
      userInput.employeeId
    );

    const updatedEmployee = {
      data: updatedEmployeeRow,
      message: `** (Update) Employee with Employee ID: (${userInput.employeeId}) has been assigned a new manager with Employee ID: (${userInput.managerId}).`,
    };

    return updatedEmployee;
  }

  async deleteAnEmployee() {
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
    const sql = `SELECT CONCAT(first_name, ' ', last_name) as Name, id as Employee_ID from employees where first_name = ? AND last_name = ? AND id = ?`;
    const params = [
      userInput.fullName_id.split(', ')[1],
      userInput.fullName_id.split(', ')[0],
      userInput.fullName_id.split(', ')[2],
    ];
    const employeeData = await this.query(sql, params);

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
        const deleteEmployeeSql = `DELETE FROM employees where first_name = ? AND last_name = ? AND id = ?`;
        const deleteEmployeeSqlParams = [
          userInput.fullName_id.split(', ')[1],
          userInput.fullName_id.split(', ')[0],
          userInput.fullName_id.split(', ')[2],
        ];
        await this.query(deleteEmployeeSql, deleteEmployeeSqlParams);

        const deletedMessage = `(Delete) Employee : ${Name} (Employee ID: ${Employee_ID}) has been deleted from the system successfully.`;
        return deletedMessage;
      }
    } else {
      console.log(
        `** (Error) Employee: ${userInput.fullName_id} does not exist. Please make sure you entered the correct name and ID.`
      );
    }
  }
}

module.exports = new EmployeeQueries();
