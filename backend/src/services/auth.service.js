const {GOOGLE_TOKEN_ENDPOINT,GOOGLE_AUTH_CLIENT_ID,GOOGLE_AUTH_CLIENT_SECRET,GOOGLE_REDIRECT_URI,JWT_SECRET} =  require('../config/env')
const {OAuth2Client} = require('google-auth-library')
const jwt = require('jsonwebtoken')

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
    return userDetails
}

const verifyGoogleToken = async (idToken) => {
    
    const oauthClient = new OAuth2Client()
    const result = await oauthClient.verifyIdToken({idToken:idToken,audience: GOOGLE_AUTH_CLIENT_ID});
    
    const payload = await result.getPayload();

    const jwtToken = createJWTToken(payload)
    const verifiedData = {
        name:payload.name,
        email:payload.email,
        picture:payload.picture,
        jwt:jwtToken
    }
    return {...verifiedData}
}

const createJWTToken = (userDetails) => {
    const jwtExpiry =  (EXPIRY_HRS * 60 + EXPIRY_MINS)  * 60;  
    const jwtPayload = {
        name:userDetails.name,
        email:userDetails.email,
        sub:userDetails.sub,
    }
    const signedToken = jwt.sign(jwtPayload,JWT_SECRET,{expiresIn:jwtExpiry});
    return signedToken;
}

module.exports = {getGoogleTokens,verifyGoogleToken}