const { logger } = require("../config/logger");
const { createUser, fetchUserbyID, fetchUserByGoogleSub } = require("../repositories/user.repository");

const createNewUser = async (userDetails) => {

    try{
        const user = await createUser(userDetails);
        if(user){
            const userModification = {
                id:user._id,
                name:user.name,
                email:user.email,
                googleSub: user.googleSub,
                createdAt:user.createdAt,
                updatedAt:user.updatedAt
            }
            return {
                success:true,
                user:userModification,
            };
        }
    }catch(err){
        logger.error("error Creating User",err)
        throw err
    }


}

const fetchUserDetailsById = async (userId) => {
    try{
        const userDoc = await fetchUserbyID(userId);
        if(userDoc){
            const modifiedUserDoc = {
                id:userDoc._id,
                name:userDoc.name,
                email:userDoc.email,
                googleSub: userDoc.googleSub,
                createdAt:userDoc.createdAt,
                updatedAt:userDoc.updatedAt,
            }
            return {
                success: true,
                user:modifiedUserDoc
            }
        }else{
            return {
                success:false,
                user:null
            }
        }
    }catch(err){
         logger.error("error fetching User details",err)
         throw err;
    } 
}

const fetchUserDetailsByGoogleSub = async (googleSub) => {
    try{
        const userDoc = await fetchUserByGoogleSub(googleSub);
        if(userDoc){
            const modifiedUserDoc = {
                id:userDoc._id,
                name:userDoc.name,
                email:userDoc.email,
                googleSub: userDoc.googleSub,
                createdAt:userDoc.createdAt,
                updatedAt:userDoc.updatedAt,
            }
            return {
                success: true,
                user:modifiedUserDoc
            }
        }else{
            return {
                success:false,
                user:null
            }
        }
    }catch(err){
        logger.error("error fetching User details",err)
        throw err
    } 
}

module.exports = {
    createNewUser,
    fetchUserDetailsById,
    fetchUserDetailsByGoogleSub
}