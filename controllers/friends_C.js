const User = require('../models/user_M')
const Post = require('../models/post_M')
const {StatusCodes} = require('http-status-codes')

const addFriend = async (req, res) => {
    const userId = req.user.userId
    const userFL = req.user.friends
    const newFriend = req.params.id

    const doesFriendexist = await User.findById(newFriend)

    if (!doesFriendexist) {
        throw new Error(`cannot add a friend that does not exist...thats lowkey sad. ${StatusCodes.BAD_REQUEST}`)
    }

        if(!(userFL.indexOf(newFriend)== -1) ){//if friend is already in friend list dont add
            throw new Error(`you already have ${doesFriendexist.name} as a Friend. ${StatusCodes.BAD_REQUEST}`)
        }

   const user = await User.findByIdAndUpdate(userId, {'$push':{'friends':doesFriendexist._id}},{new:true, runValidators:true});

   const token = user.createJWT()

res.status(StatusCodes.OK).json({msg:`${doesFriendexist.name}  with id ${newFriend}, added successfully`, noFriends:user.friends.length, newFriendlist:user.friends, token})
}

const removeFriend = async (req,  res) => {
    const userId = req.user.userId
    const userFL = req.user.friends
    const unaddFriend = req.params.id

    const doesFriendexist = await User.findById(unaddFriend)

    if(!doesFriendexist){
        throw new Error(`cannot remove a friend that does not exist. ${StatusCodes.BAD_REQUEST}`)
    }

        if((userFL.indexOf(unaddFriend)== -1) ){ //do nothing if user is not in the list
            throw new Error(`you don't have ${doesFriendexist.name} as a Friend. ${StatusCodes.BAD_REQUEST}`)
        }

        if(unaddFriend === userId ){ //you can't unadd yourself
            throw new Error(`Why would you want to commit suicide? \n you dont have the authorization to do that. ${StatusCodes.BAD_REQUEST}`)
        }

    const user = await User.findByIdAndUpdate(userId, {'$pull':{'friends':doesFriendexist._id}},{new:true, runValidators:true})

    const token = user.createJWT()

res.status(StatusCodes.OK).json({msg:`${doesFriendexist.name} with id ${unaddFriend}, removed successfully`, noFriends:user.friends.length, newFriendlist:user.friends, token})    
}

const singleFriend = async (req, res) => { //you get a users/your friend public details and his/her posts
    const friendId = req.params.id

    const user = await User.findById(friendId).select('_id name')

   // console.log(user)

    if(!user){
        throw new Error(`No user with id ${friendId} exists`)
    }

    const posts = await Post.find({postedBy: friendId}).sort('createdAt').select('title content updatedAt')

   // console.log(posts)


res.status(StatusCodes.OK).json({user, posts})
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







module.exports = {addFriend, allFriends, singleFriend, removeFriend}