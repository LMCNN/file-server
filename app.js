// load express
const express = require('express');

// load third party middleware
const morgan = require('morgan');
var favicon = require('serve-favicon');
var path = require('path');

// create application object
const app = express();

// load routes
const files = require('./routes/files');

// set view engine
app.set('view engine', 'pug');
app.set('views', './views');

// use third party middleware
app.use(express.static('public'));
app.use(morgan('tiny'));
app.use(favicon(path.join(__dirname, 'favicon.ico')));

// use routes
app.use('/', files);

// PORT
const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}...`);
});