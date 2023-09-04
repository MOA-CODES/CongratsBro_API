const express = require('express')
const router = express.Router()

const {addFriend, allFriends, singleFriend, removeFriend} = require('../controllers/friends_C')

router.route('/').get(allFriends)
router.route('/:id').get(singleFriend)
router.route('/add/:id').patch(addFriend)
router.route('/unadd/:id').patch(removeFriend)


module.exports = router