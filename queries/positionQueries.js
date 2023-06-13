const db = require('../config/db');
const inquirer = require('inquirer');
const validator = require('validator');

class PositionQueries {
  
  async query(sql, params) {
    try {
      return await db.query(sql, params);
    } catch (err) {
      console.error('Database query error:', err.message);
      throw err;
    }
  }

  async getAllPositions() {
    const sql = `
      SELECT positions.id as Position_ID, title as Title, salary as Salary, department_name as Department
      FROM positions
      LEFT JOIN departments ON positions.department_id = departments.id
      ORDER BY positions.id ASC
    `;
    return await this.query(sql);
  }

  async addNewPosition() {
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
        validate: (position) => {
          if (!validator.isEmpty(position) && validator.isAlpha(position)) {
            return true;
          } else {
            return 'Please enter a valid position title (letters only, no spaces)';
          }
        },
      },
      {
        name: 'salary',
        type: 'input',
        message: 'What is the salary of the new position?',
        validate: (salary) => {
          if (!validator.isEmpty(salary) && validator.isNumeric(salary)) {
            return true;
          } else {
            return 'Please enter a valid salary (numbers only, no spaces)';
          }
        },
      },
      {
        name: 'department',
        type: 'list',
        message: 'Which department should the new position be in?',
        choices: [...departmentNames],
      },
    ]);

    const sql = `INSERT INTO positions (title, salary, department_id) VALUES (?, ?, ?)`;
    const params = [
      userInput.position,
      userInput.salary,
      `${
        departmentData.find(
          (department) => department.department_name === userInput.department
        ).id
      }`,
    ];
    await this.query(sql, params);

    const newPositionSql = `SELECT department_name as Department, title as Position, salary as Salary from positions JOIN departments on departments.id = positions.department_id where title = ?`;
    const newPositionParams = userInput.position;
    const newPosition = await this.query(newPositionSql, newPositionParams);

    const returnObject = {
      message: `** (New) ${userInput.position} position has been successfully added to ${userInput.department} Department.`,
      data: newPosition,
    };
    return returnObject;
  }

  async deleteAPosition() {
    const sql = `SELECT title from positions ORDER BY title asc`;
    const positionData = await this.query(sql);
    const positionNames = positionData.map((position) => position.title);

    const userInput = await inquirer.prompt([
      {
        name: 'position',
        type: 'list',
        message: 'Which position would you like to delete?',
        choices: [...positionNames, '<= Go back'],
      },
    ]);

    if (userInput.position !== '<= Go back') {
      const finalCheckInput = await inquirer.prompt([
        {
          name: 'finalCheck',
          type: 'confirm',
          message:
            'Delete the selected position? (CAUTION: This action is irreversible!)',
          default: false,
        },
      ]);

      if (finalCheckInput) {
        const sql = `DELETE FROM positions where title = ?`;
        const params = userInput.position;
        await this.query(sql, params);

        const deletedConfirmation = `** (Delete) Position: ${userInput.position} has been deleted successfully from the system.`;
        return deletedConfirmation;
      }
    }
  }
  
}

module.exports = new PositionQueries();
