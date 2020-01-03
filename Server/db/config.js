const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Attendance');
mongoose.Promise = global.Promise;

module.exports = {
    mongoose, 
    secretOrKey: "secret"
};