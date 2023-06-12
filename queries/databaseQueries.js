const inquirer = require('inquirer');
const db = require('../config/db');
const DepartmentQueries = require('./departmentQueries.js');
const EmployeeQueries = require('./employeeQueries.js');
const PositionQueries = require('./positionQueries.js');

process.stdin.setMaxListeners(20);

class DatabaseQueries {
  constructor(db) {
    this.db = db;
    this.departmentQueries = new DepartmentQueries(db);
    this.employeeQueries = new EmployeeQueries(db);
    this.positionQueries = new PositionQueries(db);
  }

  // exitApplication function to handle exiting the application
  exitApplication = () => {
    console.log('Goodbye!');
    return process.exit();
  };

  // mainMenu function to handle the main menu
  mainMenu = async () => {
    // prompt the user to choose from the following options
    const userInput = await inquirer.prompt([
      {
        name: 'options',
        type: 'list',
        message: 'Please choose from the followings:',
        choices: [
          '1. View Options for Departments',
          '2. View Options for Positions',
          '3. View Options for Employees',
          'Exit the application',
        ],
      },
    ]);
    // create a selection object to handle appropriate actions based on user input
    const selection = {
      '1. View Options for Departments': this.viewDepartmentOptions,
      '2. View Options for Positions': this.viewPositionOptions,
      '3. View Options for Employees': this.viewEmployeeOptions,
      'Exit the application': this.exitApplication,
    };
    // select the appropriate action based on user input
    const selectedAction = selection[userInput.options];
    if (selectedAction) {
      await selectedAction();
    }
    return;
  };

  // viewDepartmentOptions function to handle department options
  viewDepartmentOptions = async () => {
    // while loop to keep the user in the department options menu until they choose to go back
    while (true) {
      // prompt the user to choose from the following options
      const userInput = await inquirer.prompt([
        {
          name: 'options',
          type: 'list',
          message: 'Please choose from the following:',
          choices: [
            '1. View all departments',
            '2. View budget of departments',
            '3. Add a new department',
            '4. Update an existing department',
            '5. Delete an existing department (CAUTION: This action is irreversible!)',
            '<= Go Back',
          ],
        },
      ]);
      // create a selection object to handle appropriate actions based on user input
      const selection = {
        // bind the appropriate function to the departmentQueries object; this is done to ensure that the 'this' keyword in the function refers to the departmentQueries object
        '1. View all departments':
          this.departmentQueries.viewAllDepartments.bind(
            this.departmentQueries
          ),
        '2. View budget of departments': this.departmentQueries.viewBudget.bind(
          this.departmentQueries
        ),
        '3. Add a new department': this.departmentQueries.addDepartment.bind(
          this.departmentQueries
        ),
        '4. Update an existing department':
          this.departmentQueries.updateDepartment.bind(this.departmentQueries),
        '5. Delete an existing department (CAUTION: This action is irreversible!)':
          this.departmentQueries.deleteDepartment.bind(this.departmentQueries),
        '<= Go Back': () => {
          return this.mainMenu();
        },
      };
      // select the appropriate action based on user input
      const selectedAction = selection[userInput.options];
      if (selectedAction) {
        await selectedAction();
        // if the user chooses to go back, break out of the while loop
        if (userInput.options === '<= Go Back') {
          break;
        }
      }
    }
  };

  // viewPositionOptions function to handle position options
  viewPositionOptions = async () => {
    // while loop to keep the user in the position options menu until they choose to go back
    while (true) {
      // prompt the user to choose from the following options
      const userInput = await inquirer.prompt([
        {
          name: 'options',
          type: 'list',
          message: 'Please choose from the followings:',
          choices: [
            '1. View all positions',
            '2. Add a new position',
            '3. Delete an existing position (CAUTION: This action is irreversible!)',
            '<= Go Back',
          ],
        },
      ]);
      // create a selection object to handle appropriate actions based on user input
      const selection = {
        // bind the appropriate function to the departmentQueries object; this is done to ensure that the 'this' keyword in the function refers to the positionQueries object
        '1. View all positions': this.positionQueries.viewAllPositions.bind(
          this.positionQueries
        ),
        '2. Add a new position': this.positionQueries.addPosition.bind(
          this.positionQueries
        ),
        '3. Delete an existing position (CAUTION: This action is irreversible!)':
          this.positionQueries.deletePosition.bind(this.positionQueries),
        '<= Go Back': () => {
          return this.mainMenu();
        },
      };
      // select the appropriate action based on user input
      const selectedAction = selection[userInput.options];
      if (selectedAction) {
        // await the selected action
        await selectedAction();
        // if the user chooses to go back, break out of the while loop
        if (userInput.options === '<= Go Back') {
          break;
        }
      }
    }
  };

  // viewEmployeeOptions function to handle employee options
  viewEmployeeOptions = async () => {
    // while loop to keep the user in the employee options menu until they choose to go back
    while (true) {
      // prompt the user to choose from the following options
      const userInput = await inquirer.prompt([
        {
          name: 'options',
          type: 'list',
          message: 'Please choose from the followings:',
          choices: [
            '1. View all employees',
            '2. View employees by manager',
            '3. View employees by department',
            '4. Add a new employee',
            '5. Update an existing employee',
            '6. Delete an existing employee (CAUTION: This action is irreversible!)',
            '<= Go Back',
          ],
        },
      ]);
      // create a selection object to handle appropriate actions based on user input
      const selection = {
        // bind the appropriate function to the departmentQueries object; this is done to ensure that the 'this' keyword in the function refers to the employeeQueries object
        '1. View all employees': this.employeeQueries.viewAllEmployees.bind(
          this.employeeQueries
        ),
        '2. View employees by manager':
          this.employeeQueries.viewEmployeesByManager.bind(
            this.employeeQueries
          ),
        '3. View employees by department':
          this.employeeQueries.viewEmployeesByDepartment.bind(
            this.employeeQueries
          ),
        '4. Add a new employee': this.employeeQueries.addEmployee.bind(
          this.employeeQueries
        ),
        '5. Update an existing employee':
          this.employeeQueries.updateEmployee.bind(this.employeeQueries),
        '6. Delete an existing employee (CAUTION: This action is irreversible!)':
          this.employeeQueries.deleteEmployee.bind(this.employeeQueries),
        '<= Go Back': () => {
          return this.mainMenu();
        },
      };
      // select the appropriate action based on user input
      const selectedAction = selection[userInput.options];
      if (selectedAction) {
        await selectedAction();
        // if the user chooses to go back, break out of the while loop
        if (userInput.options === '<= Go Back') {
          break;
        }
      }
    }
  };
}

// export the DatabaseQueries class
module.exports = new DatabaseQueries();
