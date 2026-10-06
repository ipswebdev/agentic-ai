const {GOOGLE_TOKEN_ENDPOINT,GOOGLE_AUTH_CLIENT_ID,GOOGLE_AUTH_CLIENT_SECRET,GOOGLE_REDIRECT_URI,JWT_SECRET} =  require('../config/env')
const {OAuth2Client} = require('google-auth-library')
const jwt = require('jsonwebtoken');
const { fetchUserDetailsByGoogleSub, createNewUser } = require('./user.service');

const EXPIRY_HRS = 12;
const EXPIRY_MINS = 0

const getGoogleTokens = async (authCode) =>{
    const payload = new URLSearchParams({
        code:authCode,
        client_id:GOOGLE_AUTH_CLIENT_ID,
        client_secret:GOOGLE_AUTH_CLIENT_SECRET,
        redirect_uri:GOOGLE_REDIRECT_URI,
        grant_type:'authorization_code'
    })
    const results = await fetch(GOOGLE_TOKEN_ENDPOINT,{
        headers: {
        "Content-Type": "application/x-www-form-urlencoded"
        },
        method:'POST',
        body:payload
    })
    const google_token = await results.json();
    const userDetails = await verifyGoogleToken(google_token.id_token)
    if(userDetails && userDetails.jwt){
        return userDetails
    }else{
        return null
    }
    
}

const verifyGoogleToken = async (idToken) => {
    
    const oauthClient = new OAuth2Client()
    const result = await oauthClient.verifyIdToken({idToken:idToken,audience: GOOGLE_AUTH_CLIENT_ID});
    
    const payload = await result.getPayload();

    
        if(payload && payload.sub){
            const userDetails = await fetchUserDetailsByGoogleSub (payload.sub);
            if(userDetails.success && userDetails.user){
                const jwtToken = createJWTToken(userDetails.user)
                const verifiedData = {
                    name:payload.name,
                    email:payload.email,
                    jwt:jwtToken,
                    id:userDetails.user.id,
                }
                return {...verifiedData} 
            }else{
                const createdUser = await createNewUser({
                    name:payload.name,
                    email:payload.email,
                    googleSub:payload.sub,
                });
                if(createdUser && createdUser.user){
                    const jwtToken = createJWTToken(createdUser.user)
                    const verifiedData = {
                        name:createdUser.user.name,
                        email:createdUser.user.email,
                        id:createdUser.user.id,
                        jwt:jwtToken,
                    }
                    return {...verifiedData} 
                    }
            }
        }else{
            return null
        }
    
}

const createJWTToken = (userDetails) => {
    const jwtExpiry =  (EXPIRY_HRS * 60 + EXPIRY_MINS)  * 60; 
    const jwtPayload = {
        name:userDetails.name,
        email:userDetails.email,
        id:userDetails.id,
        googleSub:userDetails.googleSub
    }
    const signedToken = jwt.sign(jwtPayload,JWT_SECRET,{expiresIn:jwtExpiry});
    return signedToken;
}

module.exports = {getGoogleTokens,verifyGoogleToken}