const isEmpty = require('./is-empty');

const Validator = require('validator');

module.exports = function validateLoginInput(data) {
    let errors = {};

    data.Userid = !isEmpty(data.Userid) ? data.Userid : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.userType = !isEmpty(data.userType) ? data.userType : '';

    if(Validator.isEmpty(data.Userid)){
        errors.Userid = "ID field is required.";
    }

    if(Validator.isEmpty(data.password)){
        errors.password = "Password field is required.";
    }

    if(Validator.isEmpty(data.userType)){
        errors.userType = "Select the type of user";
    }

    return{
        errors, 
        isValid: isEmpty(errors)
    };
};