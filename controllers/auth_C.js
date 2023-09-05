const User = require('../models/user_M')
const {StatusCodes} = require('http-status-codes')
const customError = require('../middleware/customError')

const register = async (req, res)=> {
    const user = await User.create({...req.body})

    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({user:{name: user.name, _id: user._id}, token})
}

const login = async (req, res)=> {
    const {email, password} = req.body

    if(!email || !password){
        throw new customError('Provide email and password', StatusCodes.BAD_REQUEST)
    }

    const user = await User.findOne({email})
    if(!user){
        throw new customError('Invalid Credentials', StatusCodes.UNAUTHORIZED)
    }

    const passwordCheck = await user.comparePassword(password)
    if(!passwordCheck){
        throw new customError('Invalid Credentials', StatusCodes.UNAUTHORIZED)
    }

    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user:{name: user.name,_id: user._id,login:"sucessful"},token})
}

module.exports = {register, login}