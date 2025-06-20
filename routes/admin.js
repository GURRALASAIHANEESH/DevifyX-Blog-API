const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authMiddleware');
const isAdminOnly = require('../middleware/adminMiddleware');

const {
  getAllComments,
  deleteCommentAsAdmin,
  getAllUsers,
  deleteUser
} = require('../controllers/adminController');

// Comments
router.get('/admin/comments', authenticateUser, isAdminOnly, getAllComments);
router.delete('/admin/comments/:commentId', authenticateUser, isAdminOnly, deleteCommentAsAdmin);

// 🔥 Users
router.get('/admin/users', authenticateUser, isAdminOnly, getAllUsers);
router.delete('/admin/users/:userId', authenticateUser, isAdminOnly, deleteUser);


module.exports = router;
