const express = require('express')
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const cookieParser = require('cookie-parser');
const pug = require('pug');

var {mongoose} = require('./db/config');

const users = require('../public/routes/users');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));

//cookie-parser middleware
app.use(cookieParser());

// body-parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//passport middleware
app.use(passport.initialize());

require('./db/passport')(passport);

const publicPath = path.join(__dirname, '../public');

// use routes
app.use(express.static(publicPath));
app.use(users);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));