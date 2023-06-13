const eq = require('../queries/employeeQueries.js');
const { printTable } = require('console-table-printer');

process.stdin.setMaxListeners(20);

class EmployeeController {
  async viewAllEmployees() {
    try {
      const query = await eq.getAllEmployees();
      return printTable(query);
    } catch {
      console.error('Error displaying all employees:', err.message);
      console.log('Failed to display all employees. Please try again!');
    }
  }

  async viewEmployeesByDepartment() {
    try {
      const query = await eq.getEmployeesByDepartment();
      return printTable(query);
    } catch (err) {
      console.error('Error displaying employees by department:', err.message);
      console.log(
        'Failed to display employees by department. Please try again!'
      );
    }
  }

  async viewEmployeesByManager() {
    try {
      const query = await eq.getEmployeesByManager();
      return printTable(query);
    } catch (err) {
      console.error('Error displaying employees by manager:', err.message);
      console.log('Failed to display employees by manager. Please try again!');
    }
  }

  async addEmployee() {
    try {
      const query = await eq.addNewEmployee();
      printTable(query.data);
      console.log(query.message);
    } catch (err) {
      console.error('Error adding new employee:', err.message);
      console.log('Failed to add new employee. Please try again!');
    }
  }

  async updateEmployee() {
    try {
      const query = await eq.updateAnEmployee();
      printTable(query.data);
      console.log(query.message);
    } catch (err) {
      console.error('Error updating employee:', err.message);
      console.log('Failed to update employee. Please try again!');
    }
  }

  async deleteEmployee() {
    try {
      const query = await eq.deleteAnEmployee();
      console.log(query);
    } catch (err) {
      console.error('Error deleting employee:', err.message);
      console.log('Failed to delete employee. Please try again!');
    }
  }
}

module.exports = EmployeeController;
