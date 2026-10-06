const {getGoogleTokens} = require('../services/auth.service')
const {success, failure} = require('../utils/response.utils')
const getUserGoogleIDToken = async(req,res) => {
    const authCode = req.body.authCode;
    const fetchedUserTokens =  await getGoogleTokens(authCode); 
    if(fetchedUserTokens && fetchedUserTokens.jwt){
        return  success(res,fetchedUserTokens,"User Successfully Verified!",200)
    }else{
        return failure(res,'error verifying user',401)
    }
    
} 

module.exports = {getUserGoogleIDToken}