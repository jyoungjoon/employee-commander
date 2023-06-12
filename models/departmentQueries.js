const db = require('../config/db');
const inquirer = require('inquirer');
const { printTable } = require('console-table-printer');
const validator = require('validator');

// setMaxListeners to avoid memory leak(?)
process.stdin.setMaxListeners(20);

class DepartmentQueries {
  // viewAllDepartments function to view all departments
  async viewAllDepartments() {
    // query the database to get all departments
    const result = await db.query(
      'SELECT department_name as Department, id as Department_ID FROM departments order by Department_ID asc'
    );
    return printTable(result);
  }

  // viewBudget function to view the total utilized annual budget of departments
  async viewBudget() {
    // query the database to get the annual budget of all departments
    const result = await db.query(
      'SELECT department_name as Department, COUNT(*) as Num_of_Employees, SUM(employees.salary) as Annual_Budget FROM employees JOIN positions ON employees.position_id = positions.id JOIN departments ON positions.department_id = departments.id GROUP BY department_name ORDER BY Annual_Budget desc'
    );
    return printTable(result);
  }

  // addDepartment function to add a new department
  async addDepartment() {
    // prompt the user to enter the name of the new department
    const userInput = await inquirer.prompt({
      name: 'department',
      type: 'input',
      message: 'What is the name of the new department?',
      validate: (department) => {
        if (!validator.isEmpty(department) && validator.isAlpha(department)) {
          return true;
        } else {
          return 'Please enter a valid department name (letters only)';
        }
      },
    });

    // query the database to add the new department
    const result = await db.query(
      'INSERT INTO departments (department_name) VALUES (?)',
      [userInput.department]
    );

    // query the database to get the newly added department
    const newRow = await db.query(
      'SELECT department_name as Department, id as Department_ID from departments where department_name = ?',
      `${userInput.department}`
    );

    printTable(newRow);
    return console.log(
      `(New) ${userInput.department} Department has been successfully added!`
    );
  }

  async deleteDepartment() {
    const departmentData = await db.query(
      'SELECT id, department_name FROM departments'
    );
    const departmentNames = departmentData.map(
      (department) => department.department_name
    );
    const userInput = await inquirer.prompt([
      {
        name: 'department',
        type: 'list',
        message: 'Which department would you like to delete?',
        choices: [...departmentNames],
      },
    ]);
    await db.query('DELETE FROM departments WHERE department_name = ?', [
      userInput.department,
    ]);
    return console.log(
      `${userInput.department} Department has been successfully deleted from the database.`
    );
  }

  async updateDepartment() {
    const departmentData = await db.query(
      'SELECT id, department_name FROM departments'
    );
    const departmentNames = departmentData.map(
      (department) => department.department_name
    );
    const userInput = await inquirer.prompt([
      {
        name: 'department',
        type: 'list',
        message: 'Which department would you like to update?',
        choices: [...departmentNames],
      },
      {
        name: 'newDepartment',
        type: 'input',
        message: 'What is the new name of the department?',
        validate: (newDepartment) => {
          if (
            !validator.isEmpty(newDepartment) &&
            validator.isAlpha(newDepartment)
          ) {
            return true;
          } else {
            return 'Please enter a valid department name (letters only)';
          }
        },
      },
    ]);

    await db.query(
      'UPDATE departments SET department_name = ? WHERE department_name = ?',
      [userInput.newDepartment, userInput.department]
    );
    return console.log(
      `${userInput.department} Department has been successfully updated to ${userInput.newDepartment} Department.`
    );
  }
}

module.exports = DepartmentQueries;
