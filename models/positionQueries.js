const db = require('../config/db');
const inquirer = require('inquirer');
const { printTable } = require('console-table-printer');

process.stdin.setMaxListeners(20);
class PositionQueries {
  async viewAllPositions() {
    const result = await db.query(
      'SELECT positions.id as Position_ID, title as Title, salary as Salary, department_name as Department FROM positions LEFT JOIN departments ON positions.department_id = departments.id ORDER BY positions.id asc'
    );
    return printTable(result);
  }

  async addPosition() {
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
    await db.query(
      'INSERT INTO positions (title, salary, department_id) VALUES (?, ?, ?)',
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
    const newRow = await db.query(
      'SELECT title as Position, salary as Salary from positions where title = ?',
      `${userInput.position}`
    );

    printTable(newRow);
    return console.log(
      `
  (New) ${userInput.position} position has been successfully added!
  `
    );
  }

  async deletePosition() {
    const positionData = await db.query(
      `SELECT title from positions ORDER BY title asc`
    );

    const positionNames = positionData.map((position) => position.title);

    const userInput = await inquirer.prompt([
      {
        name: 'position',
        type: 'list',
        message: 'Which position do you wish to delete?',
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
        await db.query(
          `DELETE FROM positions where title = '${userInput.position}'`
        );
        return console.log(
          `(Delete) Position: ${userInput.position} has been deleted successfully from the system.`
        );
      }
    }
  }
}

module.exports = PositionQueries;