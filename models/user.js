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
    otp: {
        type: String,
        required: false
    },
    catogaries: {
        type: Array,
        default: ["WORK"]
    }
});

module.exports = mongoose.model("User", userSchema);