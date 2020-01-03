const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Utkarsha:SFepg5bYOj6svRE1@cluster0-6hdx7.mongodb.net/Attendance?retryWrites=true&w=majority');
mongoose.Promise = global.Promise;

module.exports = {
    mongoose, 
    secretOrKey: "secret"
};