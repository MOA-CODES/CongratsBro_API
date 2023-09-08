const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({

    title:{
        type: String,
        required: [true, 'Name is required'],
        minlength:3,
        maxLength: 30
    },
    content:{
        type: String,
        required: [true, 'provide context to this post'],
        minlength:15,
        maxLength: 150
    },
    username:{
        type:String,
        ref:'User',
    },
    postedBy:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Valid User is required'],
    }

},{timestamps:true})

module.exports = mongoose.model('Post', PostSchema)