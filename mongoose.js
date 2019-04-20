const mongoose = require('mongoose');
const dbURL = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/wmma';

mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useCreateIndex: true
})

const StrategicSavingHeader = mongoose.model('StrategicSavingHeader', {
    goal_name: String,
    goal_amount: Number,
    current_amount: Number,
    goal_status: {
        type: Boolean,
        default: false
    }
})

module.exports = {
    StrategicSavingHeader
}