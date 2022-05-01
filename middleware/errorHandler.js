module.exports = (error, req, res, next) => {
    const message = error.message || "Something went wrong. Please try again later";
    const status = error.statusCode || 500;
    res.status(status).json({
        message: message
    })
}