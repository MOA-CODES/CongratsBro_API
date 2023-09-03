const express = require('express');
const router = express.Router();

const {createPost, editPost, deletePost, getPosts, getMyPosts, getSinglePost} = require ('../controllers/posts_C')

router.route('/').get(getPosts).post(createPost)
router.route('/:id').patch(editPost).get(getSinglePost).delete(deletePost)
router.route('/user/:uid').get(getMyPosts)

module.exports = router
