var express      = require('express');
var bodyParser   = require('body-parser');
var validator    = require('validator');
var https        = require('https');
var http         = require('http');
var fs           = require('fs');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var csrf         = require('csurf');

var sslOpts = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

var knex = require('knex')({
  client: 'sqlite3',
  connection: { filename: './db.sqlite' }
});
var bookshelf = require('bookshelf')(knex);

var User = bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: true
});

var app  = express();

// Set up handlebars as render engine for html extension
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.set('views', __dirname + '/public');

app.use(bodyParser.urlencoded({ extended: true }));

// Set up cookies for CSRF protection
app.use(cookieParser());
app.use(session({
  secret: 'gitstar-signup',
  resave: false,
  saveUninitialized: false
}));
app.use(csrf());

app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') {
    return next(err);
  }

  // handle CSRF token errors here
  res.status(403);
  res.send('session has expired or form tampered with');
});

app.post('/sign-up', function (req, res) {
  var email = req.body.email;
  if (validator.isEmail(email)) {
    new User({email:req.body.email}).save().then(function (model) {
      res.status('200').json(req.body.email);
    }).catch(function (err) {
      console.error(err);
      res.status('500').json('Failed to save address');
    });
  } else {
    res.status('400').json('Invalid email address');
  }
});

app.get('/', function (req, res, err) {
  res.render('index', { csrfToken: req.csrfToken() });
});

app.use(express.static(__dirname + '/public'));

http.createServer(app).listen(3000, '127.0.0.1');
https.createServer(sslOpts, app).listen(3443, '127.0.0.1');
