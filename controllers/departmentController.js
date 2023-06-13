const dq = require('../queries/departmentQueries.js');
const { printTable } = require('console-table-printer');

// setMaxListeners to avoid memory leak(?)
process.stdin.setMaxListeners(20);

class DepartmentController {
  // viewAllDepartments function to view all departments
  async viewAllDepartments() {
    // query the database to get all departments
    try {
      const query = await dq.getAllDepartments();
      return printTable(query);
    } catch (err) {
      console.error('Error displaying all departments:', err.message);
      console.log('Failed to display all departments. Please try again!');
    }
  }

  // viewBudget function to view the total utilized annual budget of departments
  async viewBudget() {
    // query the database to get the annual budget of all departments
    try {
      const query = await dq.viewBudget();
      printTable(query);
    } catch (err) {
      console.error('Error displaying budget of all departments:', err.message);
      console.log(
        'Failed to display budget of all departments. Please try again!'
      );
    }
  }

  // addDepartment function to add a new department
  async addDepartment() {
    // prompt the user to enter the name of the new department
    try {
      const query = await dq.addADepartment();
      printTable(query.data);
      console.log(query.message);
    } catch (err) {
      console.error('Error adding department:', err.message);
      console.log('Failed to add department. Please try again!');
    }
  }

  async deleteDepartment() {
    try {
      const query = await dq.deleteADepartment();
      console.log(query);
    } catch (err) {
      console.error('Error deleting department:', err.message);
      console.log('Failed to delete department. Please try again!');
    }
  }

  async updateDepartment() {
    try {
      const query = await dq.updateADepartment();
      console.log(query);
    } catch (err) {
      console.error('Error updating department:', err.message);
      console.log('Failed to update department. Please try again!');
    }
  }
}

module.exports = DepartmentController;
