// global variables
const APP_PATH = process.env.APP_PATH;
const ROOT_PATH = process.env.ROOT_PATH;
const ROOT_NAME = process.env.ROOT_NAME;

// load express
const express = require('express');

// load third party middleware
const morgan = require('morgan');
const favicon = require('serve-favicon');
const path = require('path');

// create application object
const app = express();

// load routes
const files = require(path.join(APP_PATH, 'routes', 'files.js'));

// set view engine
app.set('view engine', 'pug');
app.set('views', path.join(APP_PATH, 'views'));

// use third party middleware
app.use(express.static(path.join(ROOT_PATH, ROOT_NAME)));
app.use(morgan('common'));
app.use(favicon(path.join(APP_PATH, 'favicon.ico')));

// use routes
app.use('/', files);

// PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}...`);
});