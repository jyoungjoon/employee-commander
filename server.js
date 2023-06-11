const express = require('express');
const Prompts = require('./controllers/inquirer');

const app = express();

Prompts.selectionMenu();

