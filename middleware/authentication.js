const User = require('../models/user_M')
const jwt = require('jsonwebtoken')
const {StatusCodes} = require('http-status-codes')
const customError = require('../middleware/customError')

const auth = async (req, res, next)=>{

    //Using bearer token form of authentication
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new customError('Authentication invalid', StatusCodes.UNAUTHORIZED)
    }

    const token = authHeader.split(' ')[1]

    try{
        const payload = jwt.verify(token,process.env.SECRET_KEY)

        //passing info to routes that have authorization
        req.user = {userId:payload.userId, name:payload.name, email:payload.email, friends:payload.friends}
        next()
    }catch(err){
        throw new customError('Authentication invalid', StatusCodes.UNAUTHORIZED)
    }

}

module.exports = auth