const express = require('express')
const hbs = require('express-hbs')
const port = 3000
var data = require('./dummy-data.json')

var app = express()
app.use(express.static('public'))
app.engine('hbs', hbs.express4({
    partialsDir: __dirname + '/views/partials'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.get('/', function (req, res) {
    res.render('index', {
        currentYear: new Date().getFullYear(),
        strat_savings: data.strat_savings
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))