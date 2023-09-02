const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({

    name:{
        type: String,
        required: [true, 'Name is required'],
    },
    content:{
        type: String,
        required: [true, 'provide context to this post'],
    },
    postedBy:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Valid User is required'],
    }

},{timestamps:true})

module.exports = mongoose.model('Post', PostSchema)