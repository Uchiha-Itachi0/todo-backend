require("dotenv").config();
const express = require('express');
const connectToDatabase = require('./database/database');
const userRoute = require('./routes/userRoute');
const errorHandler = require("./controllers/errorController");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {res.send("<h1>Radhe Radhe</h1>")})
app.use(userRoute);
app.use(errorHandler);
const PORT = process.env.PORT || 3000;

connectToDatabase
    .then((data) => console.log(`Database is connected to ${data.connection.host}`))
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is listening on ${PORT}`);
        });
    })
    .catch(error => {
        console.log(`Failed to connect to the database because 
        \n ${error.message}`);
    })
