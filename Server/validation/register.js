const isEmpty = require('./is-empty');

const Validator = require('validator');

module.exports = function validateRegisterInput(data) {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';
    data.Userid = !isEmpty(data.Userid) ? data.Userid : '';
    data.userType = !isEmpty(data.userType) ? data.userType : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';

    if(!Validator.isLength(data.name, {min: 2, max: 30})){
        errors.name = "Name must be between 2 and 30 characters.";
    }

    if(Validator.isEmpty(data.name)){
        errors.name = "Name field is required.";
    }

    if(Validator.isEmpty(data.Userid)){
        errors.Userid = "ID field is required.";
    }

    if(!Validator.isLength(data.password, {min: 6, max: 30})){
        errors.password = "Password must be atleast 6 characters";
    }

    if(Validator.isEmpty(data.password)){
        errors.password = "Password field is required.";
    }

    if(Validator.isEmpty(data.userType)){
        errors.status = "Select the type of user.";
    }

    if(!Validator.equals(data.password, data.password2)){
        errors.password2 = "Passwords must match."
    }

    if(Validator.isEmpty(data.password2)){
        errors.password2 = "Confirm password field is required.";
    }

    return{
        errors, 
        isValid: isEmpty(errors)
    };
};