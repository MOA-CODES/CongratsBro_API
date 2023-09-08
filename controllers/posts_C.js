const Post = require('../models/post_M')
const {StatusCodes} = require('http-status-codes')
const customError = require('../middleware/customError')

const createPost = async (req, res)=>{
    req.body.postedBy = req.user.userId
    req.body.username = req.user.name //changed email to username

    const post = await Post.create({...req.body})
    res.status(StatusCodes.CREATED).json(post)
}

const editPost = async (req, res)=>{
    const{body:{content, title}, user:{userId}, params:{id:postId}} = req

    let whatToEdit = {}

    if ((content)){
        whatToEdit.content = content
    } if ((title)){
        whatToEdit.title = title
    }

    if((!(whatToEdit.title)|| !(whatToEdit.content))||((whatToEdit.title === '')|| (whatToEdit.content === ''))){
        throw new customError("content or title fields can't be empty", StatusCodes.BAD_REQUEST)
    }

    const post = await Post.findOneAndUpdate({ _id:postId, postedBy:userId}, whatToEdit,{new:true, runValidators:true})

    if(!post){
        throw new customError(`No Post with id + ${postId} exists`, StatusCodes.NOT_FOUND)
    }

    res.status(StatusCodes.OK).json({msg:'edited successfully', editedPost:post})
}

const deletePost = async (req, res)=>{
    const postId = req.params.id
    const userId = req.user.userId

    const post = await Post.findOneAndDelete({_id:postId, postedBy:userId})

    if(!post){
        throw new customError(`No Post of yours with id + ${postId} exists`, StatusCodes.NOT_FOUND)
    }

    res.status(StatusCodes.OK).json({PostTitle:post.title, msg:'deleted successfully',})
}

const getSinglePost = async (req, res)=>{
    //self explanatory
    const postId = req.params.id

    const post = await Post.find({_id:postId})

    if(!post){
        throw new customError(`No Post with id ${postId} exists`, StatusCodes.NOT_FOUND)
    }

    res.status(StatusCodes.OK).json({post})

}

const getPosts = async (req, res)=>{//get your posts and that of friends
    //adding search functionality in title and content
    const {title, content, username} = req.query;

    const friends = req.user.friends

    const queryobject = {}

    queryobject.postedBy = friends

    if(title){
        queryobject.title = {$regex: title, $options: 'i'}
    }
    if(content){
        queryobject.content = {$regex: content, $options: 'i'}
    }
    if(username){
        queryobject.username = {$regex: username, $options: 'i'}
    }

    const posts = await Post.find(queryobject).sort('createdAt')

    res.status(StatusCodes.OK).json({count: posts.length, posts})
}

const getMyPosts = async (req, res)=>{
    //gets posts only from user
    const{user:{userId}, params:{ uid:paramsuserId}, query:{title, content, username}}= req

    if(!(paramsuserId === userId)) {
        throw new customError('Authentication Invalid', StatusCodes.UNAUTHORIZED)
    }

     //adding search functionality in title and content 
     const queryobject = {}
 
     queryobject.postedBy = userId
 
     if(title){
         queryobject.title = {$regex: title, $options: 'i'}
     }
     if(content){
         queryobject.content = {$regex: content, $options: 'i'}
     }
     if(username){
         queryobject.username = {$regex: username, $options: 'i'}
     }

    const posts = await Post.find(queryobject).sort('createdAt').select('_id title content updatedAt createdAt')    

    res.status(StatusCodes.OK).json({count: posts.length, posts})
}



module.exports = {createPost, editPost, deletePost, getPosts, getMyPosts, getSinglePost}