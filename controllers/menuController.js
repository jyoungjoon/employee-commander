const DepartmentController = require('./departmentController.js');
const EmployeeController = require('./employeeController.js');
const PositionController = require('./positionController.js');
const inquirer = require('inquirer');

process.stdin.setMaxListeners(20);

class Menu {
  constructor(db) {
    this.db = db;
    this.departmentQueries = new DepartmentController(db);
    this.employeeQueries = new EmployeeController(db);
    this.positionQueries = new PositionController(db);

    // exitApplication function to handle exiting the application
    this.exitApplication = () => {
      try {
        console.log('\n\n** Goodbye, Commander!\n\n');
        return process.exit();
      } catch (err) {
        console.error('Error exiting the application:', err.message);
        console.log(
          'If this error continues, please contact admin for assistance!'
        );
      }
    };

    // mainMenu function to handle the main menu
    this.mainMenu = async () => {
      // prompt the user to choose from the following options
      try {
        const userInput = await inquirer.prompt([
          {
            name: 'options',
            type: 'list',
            message: '[Main Menu] Please choose from the followings:',
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
      } catch (err) {
        console.error('Error displaying main menu:', err.message);
        console.log('Failed to display main menu. Please try again!');
      }
    };
    this.viewDepartmentOptions = async () => {
      // while loop to keep the user in the department options menu until they choose to go back
      try {
        while (true) {
          // prompt the user to choose from the following options
          const userInput = await inquirer.prompt([
            {
              name: 'options',
              type: 'list',
              message: '[Department Menu] Please choose from the following:',
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
            '1. View all departments':
              this.departmentQueries.viewAllDepartments,
            '2. View budget of departments': this.departmentQueries.viewBudget,
            '3. Add a new department': this.departmentQueries.addDepartment,
            '4. Update an existing department':
              this.departmentQueries.updateDepartment,
            '5. Delete an existing department (CAUTION: This action is irreversible!)':
              this.departmentQueries.deleteDepartment,
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
      } catch (err) {
        console.error('Error displaying department options:', err.message);
        console.log('Failed to display department options. Please try again!');
      }
    };
    this.viewPositionOptions = async () => {
      // while loop to keep the user in the position options menu until they choose to go back
      try {
        while (true) {
          // prompt the user to choose from the following options
          const userInput = await inquirer.prompt([
            {
              name: 'options',
              type: 'list',
              message: '[Position Menu] Please choose from the followings:',
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
            '1. View all positions': this.positionQueries.viewAllPositions,
            '2. Add a new position': this.positionQueries.addPosition,
            '3. Delete an existing position (CAUTION: This action is irreversible!)':
              this.positionQueries.deletePosition,
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
      } catch (err) {
        console.error('Error displaying position options:', err.message);
        console.log('Failed to display position options. Please try again!');
      }
    };

    this.viewEmployeeOptions = async () => {
      // while loop to keep the user in the employee options menu until they choose to go back
      try {
        while (true) {
          // prompt the user to choose from the following options
          const userInput = await inquirer.prompt([
            {
              name: 'options',
              type: 'list',
              message: '[Employee Menu] Please choose from the followings:',
              choices: [
                '1. View all employees',
                '2. View employees by manager',
                '3. View employees by department',
                '4. Add a new employee',
                "5. Update existing employee's position by ID",
                "6. Update existing employee's manager by ID",
                '7. Delete an existing employee (CAUTION: This action is irreversible!)',
                '<= Go Back',
              ],
            },
          ]);
          // create a selection object to handle appropriate actions based on user input
          const selection = {
            '1. View all employees': this.employeeQueries.viewAllEmployees,
            '2. View employees by manager':
              this.employeeQueries.viewEmployeesByManager,
            '3. View employees by department':
              this.employeeQueries.viewEmployeesByDepartment,
            '4. Add a new employee': this.employeeQueries.addEmployee,
            "5. Update existing employee's position by ID":
              this.employeeQueries.updateEmployeePosition,
            "6. Update existing employee's manager by ID":
              this.employeeQueries.updateEmployeeManager,
            '7. Delete an existing employee (CAUTION: This action is irreversible!)':
              this.employeeQueries.deleteEmployee,
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
      } catch (err) {
        console.error('Error displaying employee options:', err.message);
        console.log('Failed to display employee options. Please try again!');
      }
    };
  }
}

// export the DatabaseQueries class
module.exports = Menu;
