var express = require('express');
require('debug')('gitstar-landing');

var PORT = 8081;
var app = express();

app.use(express.static(__dirname + '/src'));

app.listen(PORT);
