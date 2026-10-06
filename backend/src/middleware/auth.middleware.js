const  jwt = require("jsonwebtoken");
const {JWT_SECRET} =  require('../config/env')
const {logger} = require("../config/logger");

const authMiddleware = (req,res,next) => {
    const authHeader = req.headers['authorization'];
    if(authHeader && authHeader.startsWith('Bearer ')){
        const authToken = authHeader.split(' ')[1];
        try{
            const tokenData = jwt.verify(authToken,JWT_SECRET)
            if(tokenData && tokenData.id){
                req.user = tokenData;
            }else{
                return res.status(401).send('User not authorized to Access')
            }
            next()
        }
        catch(err){
            logger.error("Token error");
            return res.status(401).send('User not authorized to Access')
        }
        
    }
    else{
        return res.status(401).send('User not authorized to Access')
    }
}

module.exports = {authMiddleware}