var express = require('express'),
    session = require('express-session'),
    expressValidator = require('express-validator'),
    pug = require('pug'),
    passport = require('passport'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    cookieSession = require('cookie-session'),
    mysql = require('./models/mysql')
    config = require('./conf/config'),
    morgan = require('morgan');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(cookieParser());
app.use(bodyParser.json());                         // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(expressValidator());
app.use(morgan('dev'));
app.use(cookieSession({ secret: config.appSecrets.stateMngmt.cookieSecret, cookie: { maxAge: 60000 } }));
app.use(session({ secret: config.appSecrets.stateMngmt.sessionSecret, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

app.engine('html', pug.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

//Authentication
require('./util/auth')(passport);

//API endpoints
require('./routes')(app);

//handle invalid requests
//If request does not map to any route redirect to default route.
app.get('*', function (req, res) {
    res.render("index");
});

//Connection pool initialization
mysql.createConnPool();

app.listen(app.get('port'), function () {
    console.log('%s: Node server started on %d ...', Date(Date.now()), app.get('port'));
});
