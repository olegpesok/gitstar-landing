var express = require('express');
require('debug')('gitstar-landing');
var util = require('util');
var fs = require('fs');

var PORT = 8081;
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/src'));

app.listen(PORT);

app.post('/submit', function(req, res, next) {
    if (req.body.email && req.body.email.trim()) {
        fs.open('emails.txt', 'a', function (err, fd) {
            if (err) {
                // We don't want to quit (still want to serve up text)
                console.log(err.message);
            }

            fs.write(
                fd,
                new Buffer(req.body.email + '\n'),
                0,
                req.body.email.length + 1,
                null,
                function (err) {
                    if (err) {
                        // We don't want to quit (still want to serve up text)
                        console.log(err.message);
                    }
                });
        });
    }

    res.status(200).json(req.body);
    next();
});
