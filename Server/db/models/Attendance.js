const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttendanceSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    Userid: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = Attendance = mongoose.model('attendance', AttendanceSchema);