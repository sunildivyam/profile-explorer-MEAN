const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();
const fileUpload = require('express-fileupload');

// API file for interacting with MongoDB
const api = require('./src/routes/api');

// Allow Cross Site Origin
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Middleware for Uploading Files.
app.use(fileUpload());


// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Static output folder
app.use(express.static(path.join(__dirname, 'static')));

// API location
app.use('/api', api);

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    //res.write("Welcome to Profile Explorer API Server");
    res.sendFile(path.join(__dirname, './static/index.html'));
});

//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running Profile Explorer API SERVER on localhost:${port}`));