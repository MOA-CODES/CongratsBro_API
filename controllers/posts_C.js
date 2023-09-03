const Post = require('../models/post_M')
const {StatusCodes} = require('http-status-codes')

const createPost = async (req, res)=>{
    req.body.postedBy = req.user.userId
    req.body.user = req.user.email

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
        throw new Error("content or title fields can't be empty")
    }

    const post = await Post.findOneAndUpdate({ _id:postId, postedBy:userId}, whatToEdit,{new:true, runValidators:true})

    if(!post){
        throw new Error(`No Post with id + ${postId} exists`)
    }

    res.status(StatusCodes.OK).json({msg:'edited successfully', editedPost:post})
}

const deletePost = async (req, res)=>{
    const postId = req.params.id
    const userId = req.user.userId

    const post = await Post.findOneAndDelete({_id:postId, postedBy:userId})

    if(!post){
        throw new Error(`No Post with id + ${postId} exists`)
    }

    res.status(StatusCodes.OK).json({PostTitle:post.title, msg:'deleted successfully',})
}

const getSinglePost = async (req, res)=>{
    //self explanatory
    const postId = req.params.id

    const post = await Post.find({_id:postId})

    if(!post){
        throw new Error(`No Post with id + ${postId} exists`)
    }

    res.status(StatusCodes.OK).json({post})

}

const getPosts = async (req, res)=>{
    //gets posts from user and users friends 
    const friends = req.user.friends

    console.log(friends)

    const posts = await Post.find({postedBy:friends})   

    res.status(StatusCodes.OK).json({count: posts.length, posts})
}

const getMyPosts = async (req, res)=>{
    //gets posts only from user
    const name = req.user.name
    const userId = req.user.userId
    const paramsuserId = req.params.uid

    if(!(paramsuserId === userId)) {
        throw new Error('Authentication Invalid')
    }

    const posts = await Post.find({postedBy:userId})   

    res.status(StatusCodes.OK).json({count: posts.length, posts})
}



module.exports = {createPost, editPost, deletePost, getPosts, getMyPosts, getSinglePost}