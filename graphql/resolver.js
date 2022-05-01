const User = require("../models/user");
const Task = require("../models/task");
const bcrypt = require("bcrypt");
const errorController = require("../controllers/errorController");
const validation = require("../validation/validation");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
module.exports = {

    me: async (_, req) => {
        try {
            if (!req.userId) {
                const error = new Error("Authorization fails");
                error.statusCode = 404;
                throw error;
            }

            const user = await User.findOne({ where: { _id: req.userId } })
            return { ...user._doc, _id: user._id.toString() }
        }
        catch (error) {
            throw error
        }


    },

    SignUp: async ({ userData }) => {
        const { name, email, password, confirmPassword } = userData;
        try {
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
                confirmPassword: hashPassword

            })
            return { ...createdUser._doc, _id: createdUser._id.toString() }

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

    createTask: async ({ taskInfo }, req) => {
        const { task, start, end } = taskInfo;
        try {
            validation.MIN_LENGTH(task);
            validation.IS_INTEGER(start);
            validation.IS_INTEGER(end);

            auth(req);
            const user = await Task.create({
                task,
                start,
                end,
                userId: req.userId
            });

            return { ...user._doc, _id: user._id.toString(), userId: user.userId }
        }
        catch (error) {
            throw error;
        }
    }
}