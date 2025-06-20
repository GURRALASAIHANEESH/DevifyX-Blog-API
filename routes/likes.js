const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authMiddleware');
const { togglePostLike, getPostLikes } = require('../controllers/likeController');

router.post('/posts/:postId/like', authenticateUser, togglePostLike);
router.get('/posts/:postId/likes', getPostLikes);

module.exports = router;
