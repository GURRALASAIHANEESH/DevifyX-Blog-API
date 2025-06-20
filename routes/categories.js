const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authMiddleware');
const {
  getAllCategories,
  createCategory,
  getPostsByCategory
} = require('../controllers/categoryController');

router.get('/categories', getAllCategories);
router.post('/categories', authenticateUser, createCategory);
router.get('/categories/:categoryId/posts', getPostsByCategory);

module.exports = router;
