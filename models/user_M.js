const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({

    name:{
        type: String,
        required: [true, 'Please provide a name'],
        minlength: 3,
        maxlength: 15,
    },
    age:{
        type:Number,
    },
    email:{
        type:String,
        required: [true, 'Please provide your email address'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email address'
        ],
        unique: true,

    },
    password:{
        type: String,
        required:[true, 'Please provide a password'],
        minlength: 6,
    },
    friends:{
        type: [mongoose.Types.ObjectId],
        ref: 'User',
    }
})

userSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(9);
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.createJWT = function(){
    return jwt.sign({userId:this._id, name:this.name}, process.env.SECRET_KEY,{expiresIn:process.env.SECRET_TIME,})
}

userSchema.methods.verify = async function(userPassword){
    const check = await bcrypt.compare(userPassword, this.password)
    return check
}

module.exports = mongoose.model('User', userSchema)
