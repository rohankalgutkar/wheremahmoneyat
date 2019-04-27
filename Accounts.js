const mongoose = require('./mongoose.js')
const _ = require('lodash')

var addNewAccount = function (bankAccountData) {
    const bankAccount = new mongoose.BankAccount(bankAccountData)
    bankAccount.save()
}

module.exports = {
    addNewAccount
}