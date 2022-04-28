const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');

const route = express.Router();

route.post('/postSignUp', [
    body('name', "Please Enter your name")
    .trim()
    .isLength({min: 2})
    .withMessage("Name should be at least 2 characters long"),
    body("email", "Please enter valid email address")
    .isEmail()
    .normalizeEmail(),
    body("password", "Please enter your password")
    .isLength({min: 8})
    .trim()
    .withMessage("Password should be at least 8 characters long"),
    body("confirmPassword", "Password should match")
    .custom((value, { req }) => {
        if(value.trim() !== req.body.password.trim()){
            throw new Error("Password should match");
        }
        return true
    })
], userController.postSignUp);

module.exports = route;
