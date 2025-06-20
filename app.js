const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Import route files
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const likeRoutes = require('./routes/likes');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const categoryRoutes = require('./routes/categories');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Route registration
app.use('/posts', postRoutes);       // e.g., /posts, /posts/:id
app.use('/', commentRoutes);         // allows /posts/:postId/comments to work
app.use('/likes', likeRoutes);       // e.g., /likes/...
app.use('/', authRoutes);
app.use('/', adminRoutes);          // e.g., /auth/register
app.use('/', categoryRoutes);
// Root route
app.get('/', (req, res) => {
  res.send('DevifyX Blog API is running with Supabase!');
});

module.exports = app;
