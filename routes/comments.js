const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authMiddleware');
const {
  addComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
  replyToComment,
  getRepliesForComment
} = require('../controllers/commentController');
const { likeOrUnlikeComment ,getCommentLikes} = require('../controllers/likeController');

// 🛡️ Protected routes
router.post('/posts/:postId/comments', authenticateUser, addComment);
router.put('/comments/:commentId', authenticateUser, updateComment);
router.delete('/comments/:commentId', authenticateUser, deleteComment);
router.post('/comments/:commentId/replies', authenticateUser, replyToComment);

// Public routes
router.get('/posts/:postId/comments', getCommentsByPost);
router.get('/comments/:commentId/replies', getRepliesForComment);
router.post('/comments/:commentId/like', authenticateUser, likeOrUnlikeComment);
router.get('/comments/:commentId/likes', getCommentLikes);
module.exports = router;
