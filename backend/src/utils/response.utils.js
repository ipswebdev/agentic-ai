const success = (res,data,message,statusCode=200) => {
    return res.status(statusCode).json({
        data,
        message,
        success:true
    })
}

const failure = (res,message="Something went wrong",statusCode=500) => {
     return res.status(statusCode).json({
        data:null,
        message,
        success:false
    })
}

module.exports = {
    success,
    failure
}