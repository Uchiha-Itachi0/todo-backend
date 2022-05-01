module.exports = {
    VALIDATION_FAILS: (message) => {
        const error = new Error(message);
        error.statusCode = 422;
        throw error
    },
    AUTHORIZATION_ERROR: (message) => {
        const error = new Error(message);
        error.statusCode = 401;
        throw error;
    },
    NOT_FOUND: (message) => {
        const error = new Error(message);
        error.statusCode = 404;
        throw error;
    }
}