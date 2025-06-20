const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Ensure you have dotenv to load environment variables

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // use service key here
);

// Register user
exports.register = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json({ message: 'User registered', user: data.user });
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) return res.status(401).json({ error: error.message });

  res.status(200).json({ message: 'Login successful', session: data.session });
};

// Get user profile from JWT
exports.getProfile = async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) return res.status(401).json({ error: 'Missing token' });

  const { data, error } = await supabase.auth.getUser(token);

  if (error) return res.status(401).json({ error: error.message });

  res.status(200).json({ user: data.user });
};

// Update user profile (name, avatar, bio)

exports.updateUserProfile = async (req, res) => {
  const { name, avatar, bio } = req.body;
  const userId = req.user.id; // ✅ middleware already authenticated user

  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: {
      name,
      avatar,
      bio
    }
  });

  if (error) {
    console.error("❌ Admin update failed:", error.message);
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({
    message: 'Profile updated (admin)',
    user_metadata: data.user.user_metadata
  });
};
// PUT /auth/change-password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = req.user; // ✅ set by authMiddleware
  const email = user.email;

  // Re-authenticate with current password
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword
  });

  if (loginError) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }

  // Update password
  const { data, error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
    password: newPassword
  });

  if (updateError) {
    return res.status(400).json({ error: updateError.message });
  }

  res.status(200).json({ message: 'Password updated successfully' });
};