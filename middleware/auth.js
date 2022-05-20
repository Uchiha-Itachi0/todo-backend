const jwt = require("jsonwebtoken");
const { AUTHORIZATION_ERROR } = require("../controllers/errorController");
module.exports = (req) => {
    let token = req.get("Authorization")
    try{
        if(!token){
            AUTHORIZATION_ERROR("Authorization Failed");
        }
        const decodedData = jwt.verify(token, process.env.MY_SECRET);
        if(!decodedData){
            AUTHORIZATION_ERROR("Authorization Failed. Invalid token");
        }
        req.userId = decodedData.userId;
    }
    catch(error){
        throw error;
    }

}