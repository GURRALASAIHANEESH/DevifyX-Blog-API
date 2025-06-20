const supabase = require('../utils/supabaseClient');

// Get all comments (admin)
exports.getAllComments = async (req, res) => {
  const { data, error } = await supabase
    .from('comments')
    .select('*');

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ total: data.length, comments: data });
};

// Delete any comment by ID (admin)
exports.deleteCommentAsAdmin = async (req, res) => {
  const { commentId } = req.params;

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ message: 'Comment deleted by admin' });
};
// List all users
exports.getAllUsers = async (req, res) => {
  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ total: data.users.length, users: data.users });
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ message: `User ${userId} deleted successfully` });
};
