const db = require('../config/db');
const inquirer = require('inquirer');
const validator = require('validator');

class DepartmentQueries {
  async query(sql, params) {
    try {
      return await db.query(sql, params);
    } catch (err) {
      console.error('Database query error:', err.message);
    }
  }

  async getAllDepartments() {
    const sql =
      'SELECT department_name as Department, id as Department_ID FROM departments order by Department_ID asc';
    const result = await this.query(sql);
    return result;
  }

  async viewBudget() {
    const sql =
      'SELECT department_name as Department, COUNT(*) as Num_of_Employees, SUM(employees.salary) as Annual_Budget FROM employees JOIN positions ON employees.position_id = positions.id JOIN departments ON positions.department_id = departments.id GROUP BY department_name ORDER BY Annual_Budget desc';
    const result = await this.query(sql);
    return result;
  }

  async addADepartment() {
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

    const sql = 'INSERT INTO departments (department_name) VALUES (?)';
    const params = [userInput.department];
    await this.query(sql, params);

    const newDepartmentSql =
      'SELECT department_name as Department, id as Department_ID from departments where department_name = ?';
    const newDepartmentParams = [userInput.department];
    // query the database to get the newly added department
    const newDepartmentRow = await this.query(
      newDepartmentSql,
      newDepartmentParams
    );

    const newDepartment = {
      data: newDepartmentRow,
      message: `** (New) ${userInput.department} Department has been successfully added!`,
    };

    return newDepartment;
  }

  async deleteADepartment() {
    const departmentData = await this.query(
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

    const sql = 'DELETE FROM departments WHERE department_name = ?';
    const params = [userInput.department];
    await this.query(sql, params);

    const deleteConfirmationMsg = `** ${userInput.department} Department has been successfully deleted from the database.`;
    return deleteConfirmationMsg;
  }

  async updateADepartment() {
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

    const updatedDepartmentMsg = `** ${userInput.department} Department has been successfully updated to ${userInput.newDepartment} Department.`;

    return updatedDepartmentMsg;
  }
}

module.exports = new DepartmentQueries();
