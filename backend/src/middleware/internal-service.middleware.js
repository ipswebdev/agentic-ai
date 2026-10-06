const { INTERNAL_API_KEY } = require("../config/env");
const logger = require('../config/logger')

const internalServiceMiddleware = (req,res,next) => {
    const internalKey = req.headers['x-internal-service-key'];
    console.log(req.url,internalKey)
    try{
            const internalSecret = INTERNAL_API_KEY;
            if(!internalKey || internalKey !== internalSecret){
                return res.status(401).send('User not authorized to Access')
            }
            next()
        }
        catch(err){
            logger.error("Internal Key Error");
            return res.status(401).send('API Access NOT authorized to Access')
        }
}

module.exports={
internalServiceMiddleware
}