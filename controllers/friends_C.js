const User = require('../models/user_M')
const {StatusCodes} = require('http-status-codes')
const mongoose = require('mongoose')

const addFriend = async (req, res) => {
    const userId = req.user.userId
    const usersFriends = req.user.friends
    const newFriend = req.params.id

    const doesFriendexist = await User.findById(newFriend)

    if (!doesFriendexist) {
        res.status(StatusCodes.BAD_REQUEST).json({msg: 'cannot add a friend that does not exist...thats lowkey sad.'})
    }

    const getuser = await User.findById(userId)

//having an issue updating friend list

   const user = await User.findByIdAndUpdate(userId, friends.push(doesFriendexist._id),{new:true, runValidators:true});

   res.status(StatusCodes.OK).json({msg: `friend with id ${newFriend}, added successfully`, noFriends:user.friends.length ,newFriendlist: user.friends})

}

const allFriends = async (req, res) => {
    const usersFriends = req.user.friends

    let message;
    if(usersFriends.length <= 1){
        message = 'You have no friends, thats just you'
    }else{
        message = `${usersFriends.length} friends`
    }

    const friends = await User.find({_id:usersFriends}).sort('name').select('_id name')

    res.status(StatusCodes.OK).json({msg:message,friends})
}

const singleFriend = async (req, res) => {

}

const removeFriend = async (req,  res) => {

}



module.exports = {addFriend, allFriends, singleFriend, removeFriend}