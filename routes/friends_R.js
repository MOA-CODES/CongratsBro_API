const express = require('express')
const router = express.Router()

const {addFriend, allFriends, singleFriend, removeFriend} = require('../controllers/friends_C')

router.route('/').get(allFriends)
router.route('/:id').patch(addFriend).get(singleFriend).delete(removeFriend)

module.exports = router