const mongoose = require('mongoose');
const dbURL = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/wmma';

mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useCreateIndex: true
})

const StrategicSavingHeader = mongoose.model('StrategicSavingHeader', {
    username: String,
    goal_name: String,
    goal_amount: Number,
    current_amount: Number,
    goal_status: {
        type: Boolean,
        default: false
    }
})

const BankAccount = mongoose.model('BankAccount', {
    username: String,
    acc_name: String,
    current_amount: Number,
    acc_type: String
})


module.exports = {
    StrategicSavingHeader,
    BankAccount
}