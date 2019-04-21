const express = require('express')
const hbs = require('express-hbs')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000;
// var data = require('./dummy-data.json')
var StrategicSaving = require('./StrategicSaving.js')

// Auth
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');


var app = express()
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended: true
}));
app.engine('hbs', hbs.express4({
    partialsDir: __dirname + '/views/partials'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// Auth
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'salt&pepper',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated();
    if (res.locals.isAuthenticated)
        res.locals.user = req.session.passport.user;
    next();
})

hbs.registerHelper('stratSavingsData', function (strat_savings_data) {
    return StrategicSaving.generateStratSavingOutput(strat_savings_data);
});

// Auth
passport.use(new localStrategy(
    function (username, password, done) {
        if ((username == 'rohan' && password == '1') || (username == 'siddhi' && password == '2'))
            return done(null, username);
        else {
            return done(null, false, {
                message: 'Incorrect password.'
            });
        }
    }
));
// Auth setup
passport.serializeUser(function (user_id, done) {
    done(null, user_id);
});

passport.deserializeUser(function (user_id, done) {
    done(null, user_id);
});

app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
        // failureFlash: true
    })
);

app.get('/login', function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('login', {
            currentYear: new Date().getFullYear()
        })
    }
})

// added authenticationMiddleware Auth
app.get('/', authenticationMiddleware(), function (req, res) {
    var stratSavings = StrategicSaving.getStratSavings();
    stratSavings.then((stratSavingsData) => {

        console.log('retrieved data ' + stratSavingsData);
        console.log('req.session.passport' + req.session.passport);

        var stratSavingsHeader = StrategicSaving.getStratSavingsHeader(stratSavingsData);

        res.render('index', {
            username: req.session.passport.user,
            currentYear: new Date().getFullYear(),
            strat_savings_total: stratSavingsHeader.totalStratSavings,
            strat_savings_count: stratSavingsHeader.stratSavingsCount,
            strat_savings_data: stratSavingsData
        })
    }).catch((e) => {
        console.log('Didnt work' + e);
    });
});

// Strategic Savings
app.post('/add-strat-saving', function (req, res) {
    StrategicSaving.addNewStrategicSaving(req.body)
    res.redirect('/#strat-saving-okay');
})

// Auth
// Logout
app.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

function authenticationMiddleware() {
    return (req, res, next) => {
        console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

        if (req.isAuthenticated()) return next();
        res.redirect('/login')
    }
}
app.listen(port, () => console.log(`WMMA Running on Port ${port}`))