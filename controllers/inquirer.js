const inquirer = require('inquirer');
const DatabaseQueries = require('../db/queries');

class Prompts {
  selectionMenu = async () => {
    const userInput = await inquirer.prompt([
      {
        name: 'main',
        type: 'list',
        message: 'Please choose from the followings:',
        choices: [
          '1. View All Departments',
          '2. View All Roles',
          '3. View All Employees',
          '4. Add a Department',
          '5. Add a Role',
          '6. Add an Employee',
          '7. Update an Employee Role',
        ],
      },
    ]);

    const selection = {
      '1. View All Departments': DatabaseQueries.viewAllDepartments,
      '2. View All Roles': DatabaseQueries.viewAllRoles,
      '3. View All Employees': DatabaseQueries.viewAllEmployees,
      '4. Add a Department': DatabaseQueries.addDepartment,
      '5. Add a Role': DatabaseQueries.addRole,
      '6. Add an Employee': DatabaseQueries.addEmployee,
      '7. Update an Employee Role': DatabaseQueries.updateEmployeesRole,
    };

    const selectedAction = selection[userInput.main];
    if (selectedAction) {
      await selectedAction();
    } else {
      this.selectionMenu();
    }
    this.selectionMenu();
  };
}

module.exports = new Prompts();
