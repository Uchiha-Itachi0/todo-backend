const validator = require("validator");
const errorController = require("../controllers/errorController");

module.exports = {
    EMAIL: (email) => {
        if (!validator.isEmail(email)) {
            errorController.VALIDATION_FAILS("Invalid email address");
        }
    },
    PASSWORD_LENGTH: (password) => {
        if (!validator.isLength(password, { min: 8 })) {
            errorController.VALIDATION_FAILS("Password is too short. Password must be at least of 8 characters");
        }
    },
    PASSWORD_MATCH: (password, confirmPassword) => {
        if (!validator.equals(password, confirmPassword)) {
            errorController.VALIDATION_FAILS("Password must match");
        }
    },
    IS_INTEGER: (value) => {
        if(!validator.isInt(String(value))){
            errorController.VALIDATION_FAILS("Must be Integer");
        }
    },
    MIN_LENGTH: (value) => {
        if(!validator.isLength(value, {min: 1})){
            errorController.VALIDATION_FAILS("Input field cannot be empty");
        }
    }
}