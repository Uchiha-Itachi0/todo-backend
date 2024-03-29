const User = require("../models/user");
const Task = require("../models/task");
const bcrypt = require("bcrypt");
const errorController = require("../controllers/errorController");
const validation = require("../validation/validation");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const { update } = require("../models/user");
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});
module.exports = {

    me: async (_, req) => {
        auth(req);
        try {
            const user = await User.findById(req.userId)
            return { ...user._doc, _id: user._id.toString(), message: "user data" }
        }
        catch (error) {
            throw error
        }

    },

    SignUp: async ({ userData }) => {
        const { name, email, password, confirmPassword } = userData;
        try {
            validation.MIN_LENGTH(name);
            validation.EMAIL(email);
            validation.PASSWORD_LENGTH(password);
            validation.PASSWORD_MATCH(password, confirmPassword);
            const user = await User.findOne({ email: email });
            if (user) {
                errorController.VALIDATION_FAILS("User already exists. Please enter another email address or try to login.");
            }
            const hashPassword = await bcrypt.hash(password, 10);
            if (!hashPassword) {
                const error = new Error("Something went wrong. Please try again.");
                error.statusCode = 400
                throw error
            }
            const createdUser = await User.create({
                name,
                email,
                password: hashPassword,
            })
            return { ...createdUser._doc, _id: createdUser._id.toString(), message: "Successfully signed up. Please Login to Continue" }

        }
        catch (error) {
            throw error;
        }
    },

    LogIn: async ({ userLoginData }) => {
        const { email, password } = userLoginData;
        try {
            validation.EMAIL(email);
            validation.PASSWORD_LENGTH(password);
            const user = await User.findOne({ email });
            if (!user) {
                errorController.VALIDATION_FAILS("This email address does not exists in our database. Please try to sign in or use another email address.");
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                errorController.VALIDATION_FAILS("Wrong password. Please try again")
            }

            const accessToken = jwt.sign({ userId: user._id }, process.env.MY_SECRET, { expiresIn: "1d" });
            return { ...user._doc, _id: user._id.toString(), token: accessToken }
        }
        catch (error) {
            throw error
        }
    },

    sendOTP: async ({ email }) => {
        try {
            validation.EMAIL(email);
            const user = await User.findOne({ email });
            if (!user) {
                errorController.VALIDATION_FAILS("This email address does not exists in our database. Please try to sign in or use another email address.");
            }
            const otp = Math.floor(100000 + Math.random() * 900000);
            const hashOTP = await bcrypt.hash(otp.toString(), 10);
            if (!hashOTP) {
                const error = new Error("Something went wrong. Please try again.");
                error.statusCode = 400
                throw error
            }
            await transporter.sendMail({
                to: email,
                from: process.env.EMAIL,
                subject: 'OTP To login',
                html: `
                <h1>Hey, Welcome to The JAR</h1>
                <p>Here's Your OTP ${otp}</p>`
            }).catch(error => console.log(error))
            const otpSent = await User.updateOne({ email }, { hashOTP });

            if (!otpSent) {
                errorController.VALIDATION_FAILS("Something went wrong. Please try again.")
            }
            return { message: "OTP sent successfully" }
        }
        catch (error) {
            throw error
        }
    },

    createTask: async ({ taskInfo }, req) => {
        const { task, catagory } = taskInfo;
        try {
            validation.MIN_LENGTH(task);
            auth(req);
            const user = await Task.create({
                task,
                catagory,
                userId: req.userId
            });

            return { ...user._doc, _id: user._id.toString(), userId: user.userId }
        }
        catch (error) {
            throw error;
        }
    },

    getTask: async ({ getTaskInfo }, req) => {
        const { userId, catogary, showCompletedTask } = getTaskInfo;
        try {
            auth(req);
            let task;
            if (showCompletedTask) {
                task = await Task.find({ userId: userId, completed: true });
            }
            else{
                task = await Task.find({ userId: userId, catagory: catogary, completed: false });
            }
            const taskData = task.map(value => {
                return { id: value._id, task: value.task }
            })
            return taskData
        }
        catch (error) {
            throw error;
        }
    },

    deleteTask: async ({ deleteTaskInfo }, req) => {
        const { taskId } = deleteTaskInfo;
        try {
            auth(req);
            const task = await Task.findById(taskId);
            if (!task) {
                errorController.NOT_FOUND("This task does not exists");
            }
            if (task.userId.toString() !== req.userId.toString()) {
                errorController.AUTHORIZATION_ERROR("Authorization fails. You cannot delete this task");
            }
            await Task.findByIdAndDelete(taskId);
            return "Successfully delete the task from the database";
        }
        catch (error) {
            throw error;
        }
    },

    editTask: async ({ editTaskInfo }, req) => {
        const { taskId, taskValue } = editTaskInfo;
        try {
            auth(req);
            const task = await Task.findById(taskId);
            if (!task) {
                errorController.NOT_FOUND("This task does not exist");
            }
            if (task.userId.toString() !== req.userId.toString()) {
                errorController.AUTHORIZATION_ERROR("Authorization fails. You cannot edit this task");
            }
            const updatedTask = await Task.findByIdAndUpdate(taskId, {
                task: taskValue
            }, { new: true });    // New field tell the mongoose to return the updated task.

            return { ...updatedTask._doc, _id: updatedTask._id.toString() }
        }
        catch (error) {
            throw error;
        }
    },
    completeTask: async ({ completeTaskInfo }, req) => {
        const { taskId, state } = completeTaskInfo;
        auth(req);
        const task = await Task.findById(taskId);
        if (!task) {
            errorController.NOT_FOUND("This task does not exist");
        }
        if (task.userId.toString() !== req.userId.toString()) {
            errorController.AUTHORIZATION_ERROR("Authorization fails. You cannot edit this task");
        }
        await Task.findByIdAndUpdate(taskId, {
            completed: state
        }, { new: true });
        return state ? "Congratulations🎉😁" : "Successfully Restored"

    },
    addCatogary: async ({ addCatogaryInfo }, req) => {
        const { userId, catogary } = addCatogaryInfo;
        try {
            auth(req);
            validation.MIN_LENGTH(catogary);
            const upperCaseCatogary = validation.CATOGARY(catogary);
            if (userId !== req.userId) {
                errorController.AUTHORIZATION_ERROR("Cannot add the catogary in the user");
            }
            const user = await User.findById(userId);
            if (!user) {
                errorController.NOT_FOUND("Cannot find this user");
            }

            user.catogaries.forEach(element => {
                if (element.trim() === upperCaseCatogary.trim()) {
                    errorController.VALIDATION_FAILS("This catogary is already created please create another one or add task to the existing catogary");
                }
            })
            user.catogaries.push(upperCaseCatogary);
            user.save();

            return { ...user._doc, _id: user._id.toString() }
        }
        catch (error) {
            throw error;
        }

    },
    deleteCatogary: async ({ deleteCatogaryInfo }, req) => {
        const { projectId, projectName } = deleteCatogaryInfo;
        try {
            auth(req);
            const user = await User.findById(projectId);
            if (!user) {
                errorController.NOT_FOUND("This project does not exists");
            }
            if (user._id.toString() !== req.userId.toString()) {
                errorController.AUTHORIZATION_ERROR("Authorization fails. You cannot delete this task");
            }
            user.catogaries.splice(user.catogaries.indexOf(projectName), 1);
            user.save();
            await Task.deleteMany({ catagory: projectName, userId: projectId});
            return { catogaries: user.catogaries, message: `Successfully delete ${projectName} from the database` }
        }
        catch (error) {
            throw error;
        }
    }
}
