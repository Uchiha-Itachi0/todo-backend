const mongoose = require('mongoose');

const connectToDatabase = mongoose.connect(process.env.DATABASE_URI);

module.exports = connectToDatabase;