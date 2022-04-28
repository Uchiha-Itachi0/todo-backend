const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const User = require('../models/user');

const route = express.Router();

route.post('/postSignUp', [
    body('name', "Please Enter your name")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Name should be at least 2 characters long"),
    body("email", "Please enter a valid email address")
        .isEmail()
        .normalizeEmail()
        .custom(async (value) => {
            try {
                const user = await User.findOne({ email: value });
                if (user) {
                    return Promise.reject("This email already exists. Please try to login or enter new email");
                }
                return true
            }
            catch(error){
                return Promise.reject("Someting went wrong");
            }
        }),
    body("password", "Please enter your password")
        .isLength({ min: 8 })
        .trim()
        .withMessage("Password should be at least 8 characters long"),
    body("confirmPassword", "Password should match")
        .custom((value, { req }) => {
            if (value.trim() !== req.body.password.trim()) {
                throw new Error("Password should match");
            }
            return true
        })
], userController.postSignUp);

module.exports = route;
