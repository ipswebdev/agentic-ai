const {logger} = require('../config/logger');
const { UserFetchByGoogleSubException, UserSaveException, UserFetchByIdException } = require('../exceptions/repository.exception');
const  { User } = require('../models/user.model');

const createUser = async(userDetails) => {
    try{
        const res = await User.create(userDetails);
        return res;
    }catch(err){
        logger.error('Error creating User',err);
        throw new UserSaveException('Error fetching Userby Google Sub');
    }
}

const fetchUserByGoogleSub = async(googleSub) => {
    try{
        const res = await User.findOne({googleSub:googleSub});
        return res;
    }catch(err){
        logger.error('Error fetching Userby Google Sub',err);
        throw new UserFetchByGoogleSubException('Error fetching Userby Google Sub')
    }
}

const fetchUserbyID = async(userId) => {
    try{
        const res = await User.findById(userId);
        return res;
    }catch(err){
        logger.error('Error fetching User',err);
        throw new UserFetchByIdException('Error fetching User');
    }
}

module.exports = {
    createUser,
    fetchUserbyID,
    fetchUserByGoogleSub
}