const express = require('express');
const { registerUser, loginUser } = require('../controllers/auth.controller');
const router = express.Router();
const { followUser, unfollowUser } = require('../controllers/people.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const { createPost, getFeed } = require('../controllers/posts.controller');

router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/addPost',authMiddleware,createPost);
router.post('/follow', authMiddleware, followUser);
router.delete('/unfollow/:unfollowId', authMiddleware, unfollowUser);
router.get('/feed', authMiddleware, getFeed);

module.exports = router;