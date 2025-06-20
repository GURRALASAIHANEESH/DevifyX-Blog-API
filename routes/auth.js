const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authMiddleware');

const {
  register,
  login,
  getProfile,
  updateUserProfile,
  changePassword
} = require('../controllers/authController');

// ✅ Already existing
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/profile', authenticateUser, getProfile);
router.put('/auth/profile', authenticateUser, updateUserProfile);

// ✅ New change password route
router.put('/auth/change-password', authenticateUser, changePassword);

module.exports = router;
