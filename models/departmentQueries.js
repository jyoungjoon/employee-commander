const db = require('../config/db');
const inquirer = require('inquirer');
const { printTable } = require('console-table-printer');

process.stdin.setMaxListeners(20);

class DepartmentQueries {
  async viewAllDepartments() {
    const result = await db.query(
      'SELECT department_name as Department, id as Department_ID FROM departments order by Department_ID asc'
    );
    return printTable(result);
  }

  async viewBudget() {
    const result = await db.query(
      'SELECT department_name as Department, COUNT(*) as Num_of_Employees, SUM(employees.salary) as Annual_Budget FROM employees JOIN positions ON employees.position_id = positions.id JOIN departments ON positions.department_id = departments.id GROUP BY department_name ORDER BY Annual_Budget desc'
    );
    return printTable(result);
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

    const newRow = await db.query(
      'SELECT department_name as Department, id as Department_ID from departments where department_name = ?',
      `${userInput.department}`
    );

    printTable(newRow);
    return console.log(
      `(New) ${userInput.department} Department has been successfully added!`
    );
  }

  //TODO - update and delete Department function
  deleteDepartment() {
    return db.query('DELETE from departments WHERE id = departmentId');
  }

  updateDepartment() {}
}

module.exports = DepartmentQueries;
