const User = require('../models/user_M')
const Post = require('../models/post_M')
const {StatusCodes} = require('http-status-codes')
const customError = require('../middleware/customError')

const addFriend = async (req, res) => {
    const userId = req.user.userId
    const userFL = req.user.friends
    const newFriend = req.params.id

    const doesFriendexist = await User.findById(newFriend)

    if (!doesFriendexist) {
        throw new customError(`cannot add a friend that does not exist...thats lowkey sad.`, StatusCodes.NOT_FOUND)
    }

        if(!(userFL.indexOf(newFriend)== -1) ){//if friend is already in friend list dont add
            throw new customError(`you already have ${doesFriendexist.name} as a Friend.`, StatusCodes.BAD_REQUEST)
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
        throw new customError(`cannot remove a friend that does not exist.`, StatusCodes.NOT_FOUND)
    }

        if((userFL.indexOf(unaddFriend)== -1) ){ //do nothing if user is not in the list
            throw new customError(`you don't have ${doesFriendexist.name} as a Friend.`,StatusCodes.BAD_REQUEST)
        }

        if(unaddFriend === userId ){ //you can't unadd yourself
            throw new customError('Why would you want to commit suicide? \n you dont have the authorization to do that.',StatusCodes.BAD_REQUEST)
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
        throw new customError(`No user with id ${friendId} exists`, StatusCodes.NOT_FOUND)
    }

    const posts = await Post.find({postedBy: friendId}).sort('createdAt').select('title content updatedAt')

    res.status(StatusCodes.OK).json({user, posts})
}

const allFriends = async (req, res) => {
    const{user:{friends: usersFriends}, query:{name}} = req

    const queryobject = {}

    queryobject._id = usersFriends

    if(name){
        queryobject.name = {$regex: name, $options: 'i'}
    }

    let message;
    if(usersFriends.length <= 1){
        message = 'You have no friends, thats just you'
    }else{
        message = `${usersFriends.length} friends`
    }

    const friends = await User.find(queryobject).sort('name').select('_id name')

    res.status(StatusCodes.OK).json({msg:message,friends})
}

module.exports = {addFriend, allFriends, singleFriend, removeFriend}