const User = require('../models/user_M')
const {StatusCodes} = require('http-status-codes')

const register = async (req, res)=> {
    const user = await User.create({...req.body})

    //automatically has himself as a friend to see his own posts 
    // await User.findOneAndUpdate({email: user.email}, user.friends.push(user._id) ,{new:true, runValidators:true} )
    // user.save(user)
    //i think this causes the double hashing problem

    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({user:{name: user.name}, token})
}

const login = async (req, res)=> {
    const {email, password} = req.body

    if(!email || !password){
        throw new Error('Provide email and password')
    }

    const user = await User.findOne({email})
    console.log(user.name, user.password, user.email)
    if(!user){
        throw new Error('Invalid Credentials')
    }

    const passwordCheck = await user.comparePassword(password)
    if(!passwordCheck){
        console.log('error in password verification')
        throw new Error('Invalid Credentials')
    }

    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user:{name: user.name,login:"sucessful"},token})
}

module.exports = {register, login}