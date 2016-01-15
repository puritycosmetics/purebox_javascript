var Recurly = require('node-recurly');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request')
// We'll use uuids to generate account_code values
var uuid = require('node-uuid');

var http = require('http');
// var https = require('https');
var port = process.env.PORT || 1339;
var path = require('path');

var app = express();

//app.use(bodyParser());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// var urlencode = require('urlencode');
var json = require('json-middleware');
// var multipart = require('connect-multiparty');
// var multipartMiddleware = multipart();

app.use(express.static('app'));

//app.use('/api/subscriptions/new', multipartMiddleware);

http.createServer(app).listen(port), function(req, res) {
  // res.writeHead(200, { 'Content-Type': 'text/plain' });
  // res.end('Hello Mommas\n');
};









