const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authMiddleware');

const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePostById,
  searchPosts,
  getPostsByTag,
  getFeaturedPosts,
  getPostsByUser,
  getAllTags,
} = require('../controllers/postController');
const { likeOrUnlikePost ,getPostLikes} = require('../controllers/likeController');



// 🔐 Auth-protected routes
router.post('/', authenticateUser, createPost);
router.put('/:id', authenticateUser, updatePost);
router.delete('/:id', authenticateUser, deletePostById);
router.get('/users/:userId/posts', authenticateUser, getPostsByUser);

// 🔓 Public routes
router.get('/search', searchPosts);
router.get('/featured', getFeaturedPosts);
router.get('/tag/:tagName', getPostsByTag);
router.get('/tags', getAllTags);                   // ✅ Move this ABOVE /:id
router.get('/:postId/likes', getPostLikes);        // ✅ before /:id
router.post('/:postId/like', authenticateUser, likeOrUnlikePost);
router.get('/:id', getPostById);                   // 🔴 This must be LAST
router.get('/', getAllPosts);


module.exports = router;
