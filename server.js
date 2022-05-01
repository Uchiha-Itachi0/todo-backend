require("dotenv").config();
const express = require('express');
const connectToDatabase = require('./database/database');
const { graphqlHTTP } = require('express-graphql');
const Schema = require('./graphql/graphqlSchema');
const rootResolver = require('./graphql/resolver');
const errorHandler = require("./middleware/errorHandler");
const app = express();

app.use(express.json());

app.use("/graphql", graphqlHTTP({
    schema: Schema,
    rootValue: rootResolver,
    graphiql: true,
    customFormatErrorFn(error) {
        if(!error.originalError){
            return error;
        }
        const status = error.originalError.statusCode || 500;
        const message = error.message || "Something went wrong. Please try again later";
        return { message, status }
    }
}))
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
