const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"]
    },
    password: {
        type: String,
        required: [true, "Please enter your password"]
    },
    confirmPassword: {
        type: String,
        required: [true, "Password should match"]
    }
});

module.exports = mongoose.model("User", userSchema);