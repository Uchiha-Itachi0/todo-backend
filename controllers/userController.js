const bcrypt = require("bcrypt")
const { validationResult } = require("express-validator")
const User = require('../models/user');

// ------------POST SIGN UP------------------------
exports.postSignUp = async (req, res, next) => {
    const { name, email, password } = req.body;
    const errors = validationResult(req);

    // Checking validation errors
    if(!errors.isEmpty()){
        return res.status(400).json({
            message: errors.array()[0].msg
        })
    }
    try {
        // Securing the password
        const hashPassword = await bcrypt.hash(password, 10)
        if (!hashPassword) {
            return res.status(500).json({
                message: "Something went wrong. Please try again"
            })
        }
        // Finnaly, after all check I should create a user
        await User.create({
            name,
            email,
            password: hashPassword,
            confirmPassword: hashPassword
        });
        return res.status(200).json({
            message: "Successfully sign up"
        })
    }
    catch (error) {
        next(error);
    }

}

// ----------------Login------------------------
exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    // If there is error on validation
    if(!errors.isEmpty()){
        return res.status(400).json({
            message: errors.array()[0].msg
        })
    }

}