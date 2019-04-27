const mongoose = require('./mongoose.js')
const _ = require('lodash')

var addNewStrategicSaving = function (goalData) {
    const goal = new mongoose.StrategicSavingHeader(goalData)
    goal.save()
}

var getStratSavings = function () {
    var stratSavings = mongoose.StrategicSavingHeader;
    var stratSavingsPromise = stratSavings.find({}).sort({
        date_added: -1
    });
    return stratSavingsPromise;
}

var generateStratSavingOutput = function (stratSavingsData) {
    var output = "";

    templateStart = '<blockquote> <ul class="alt"> <li> <span class="fas fa-piggy-bank"></span> <p class="p-margin">'
    templateTotalAmt = '</p> <div class="stick-right"><span class="fas fa-money-bill-wave"></span> ₹'
    templateCurrentAmt = '</div> </li> <li> <span class="fas fa-hand-holding-usd"></span> <p class="p-margin"> ₹'
    templatePendingAmt = '</p> <span class="tbspl fas fa-comment-dollar"></span> <p class="p-margin"> ₹'
    templateEMIdone = '</p> <div class="stick-right"> <span class="tbspl fas fa-hashtag"></span> '
    templateEMIleft = '<span class="p-margin fas fa-chart-line"></span> '
    templateEnd = '</div> </li> </ul> </blockquote>'
    _.each(stratSavingsData, (stratSaving) => {
        var pending_amt = Number(stratSaving.goal_amount - stratSaving.current_amount).toLocaleString('en')
        var goal_amount = Number(stratSaving.goal_amount).toLocaleString('en')
        var current_amount = Number(stratSaving.current_amount).toLocaleString('en')
        var emi_done = 1
        var emi_left = _.floor(_.divide(stratSaving.goal_amount, stratSaving.current_amount));

        output = output + templateStart + stratSaving.goal_name + templateTotalAmt + goal_amount + templateCurrentAmt + current_amount + templatePendingAmt + pending_amt + templateEMIdone + emi_done + templateEMIleft + emi_left + templateEnd
    })

    return output
}

var getStratSavingsHeader = function (stratSavingsData) {
    var totalStratSavings = 0;
    _.each(stratSavingsData, (stratSaving) => {
        totalStratSavings = totalStratSavings + stratSaving.current_amount;
    })

    return {
        stratSavingsCount: stratSavingsData.length,
        totalStratSavings
    };
}
module.exports = {
    addNewStrategicSaving,
    getStratSavings,
    generateStratSavingOutput,
    getStratSavingsHeader
}