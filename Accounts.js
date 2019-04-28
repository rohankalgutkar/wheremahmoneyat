const mongoose = require('./mongoose.js')
const _ = require('lodash')

var addNewAccount = function (bankAccountData) {
    const bankAccount = new mongoose.BankAccount(bankAccountData)
    bankAccount.save()
}

var getBankAccounts = function () {
    var bankAccounts = mongoose.BankAccount;
    var bankAccountsPromise = bankAccounts.find({}).sort({
        date_added: -1
    });
    return bankAccountsPromise;
}

var getBankAccountsHeader = function (bankAccountData) {
    console.log('bankAccountData' + bankAccountData);

    var totalAssets = 0;
    var totalLiquid = 0;
    var totalFixed = 0;
    _.each(bankAccountData, (bankAccount) => {
        totalAssets = totalAssets + bankAccount.current_amount;
        if (bankAccount.acc_type == 'liquid') {
            totalLiquid = totalLiquid + bankAccount.current_amount;
        } else if (bankAccount.acc_type == 'fixed') {
            totalFixed = totalFixed + bankAccount.current_amount;
        }
    })

    return {
        totalAssets: Number(totalAssets).toLocaleString('en'),
        totalLiquid: Number(totalLiquid).toLocaleString('en'),
        totalFixed: Number(totalFixed).toLocaleString('en')
    }

}

var generateBankAccountsOutput = function (bankAccountsData) {

    console.log('bankAcc in generate' + JSON.stringify(bankAccountsData));
    var output = "";

    var templateStart = '<div class="block block-';
    var templateAccName = '"> <span class="fas fa-university"> </span> <p class="p-margin tpspr"> ';
    var templateAccType = '</p> <div class="inline"> <span class="p-margin fas ';
    var templateCurrentAmt = '"></span></div><h2> ₹';
    var templateEnd = '</h2> </div>'

    _.each(bankAccountsData, (bankAcc) => {
        var accType = bankAcc.acc_type;
        var accName = bankAcc.acc_name;
        var currAmt = Number(bankAcc.current_amount).toLocaleString('en');

        var type = "";
        if (accType == 'liquid') {
            type = "fa-tint"
        } else if (accType == 'fixed') {
            type = "fa-snowflake"
        }

        output = output + templateStart + accType + templateAccName + accName + templateAccType + type + templateCurrentAmt + currAmt + templateEnd;
    })

    return output
}

module.exports = {
    addNewAccount,
    getBankAccounts,
    getBankAccountsHeader,
    generateBankAccountsOutput
}