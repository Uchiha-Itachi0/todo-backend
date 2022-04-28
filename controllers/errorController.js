const errorHandler = (error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message || "Something went wrong. Please try again later"
    res.status(status).json({
        message
    });
}

module.exports = errorHandler;