const pq = require('../queries/positionQueries.js');
const { printTable } = require('console-table-printer');

class PositionController {
  
  async viewAllPositions() {
    try {
      const query = await pq.getAllPositions();
      return printTable(query);
    } catch (err) {
      console.error('Error displaying all positions:', err.message);
      console.log('Failed to display all positions. Please try again!');
    }
  }

  async addPosition() {
    try {
      const query = await pq.addNewPosition();
      printTable(query.data);
      console.log(query.message);
    } catch (err) {
      console.error('Error adding position:', err.message);
      console.log('Failed to add position. Please try again!');
    }
  }

  async deletePosition() {
    try {
      const query = await pq.deleteAPosition();
      console.log(query);
    } catch (err) {
      console.error('Error deleting position:', err.message);
      console.log('Failed to delete position. Please try again!');
    }
  }

}

module.exports = PositionController;
