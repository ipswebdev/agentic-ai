const {getGoogleTokens, verifyGoogleToken} = require('../services/auth.service')
const {success} = require('../utils/response.utils')
const getUserGoogleIDToken = async(req,res) => {
    const authCode = req.body.authCode;
    const fetchedUserTokens =  await getGoogleTokens(authCode); 
    console.log('fetchedUserTokens',fetchedUserTokens)
    return  success(res,fetchedUserTokens,"User Successfully Verified!",200)
    // if(fetchedUserTokens.jwt && fetchedUserTokens.user.name){
    //     return success(res,fetchedUserTokens,"User Successfully Verified!",200)
    // }
    
} 

module.exports = {getUserGoogleIDToken}