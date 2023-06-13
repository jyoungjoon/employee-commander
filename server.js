const Menu = require('./controllers/menuController');
const logo = require('./assets/ascii/logo');
const menu = new Menu();

logo.displayLogo();

(async function () {
  await menu.mainMenu();
})();
