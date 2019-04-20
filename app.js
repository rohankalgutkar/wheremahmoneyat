const express = require('express')
const hbs = require('express-hbs')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000;
// var data = require('./dummy-data.json')
var StrategicSaving = require('./StrategicSaving.js')

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

hbs.registerHelper('stratSavingsData', function (strat_savings_data) {
    return StrategicSaving.generateStratSavingOutput(strat_savings_data);
});

app.get('/', function (req, res) {
    var stratSavings = StrategicSaving.getStratSavings();
    stratSavings.then((stratSavingsData) => {

        console.log('retrieved data ' + stratSavingsData);

        var stratSavingsHeader = StrategicSaving.getStratSavingsHeader(stratSavingsData);

        res.render('index', {
            currentYear: new Date().getFullYear(),
            strat_savings_total: stratSavingsHeader.totalStratSavings,
            strat_savings_count: stratSavingsHeader.stratSavingsCount,
            strat_savings_data: stratSavingsData
        })
    }).catch((e) => {
        console.log('Didnt work' + e);
    });


})

// Strategic Savings
app.post('/add-strat-saving', function (req, res) {
    StrategicSaving.addNewStrategicSaving(req.body)
    res.redirect('/#strat-saving-okay');
})

app.listen(port, () => console.log(`WMMA Running on Port ${port}`))