const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User Id is missing"]
    },
    task: {
        type: String,
        required: [true, "Please enter the task"]
    },
    start: {
        type: Number,
        required: [true, "Enter when the task will start"]
    },
    end: {
        type: Number,
        required: [true, "Enter when the task will end"]
    }
});

module.exports = mongoose.model("Task", taskSchema);