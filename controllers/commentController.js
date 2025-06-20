const supabase = require('../utils/supabaseClient');

exports.getCommentsByPost = async (req, res) => {
  const { postId } = req.params;

  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .is('parent_id', null) // Only top-level comments for now
    .order('created_at', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ comments: data });
};

exports.addComment = async (req, res) => {
  const { postId } = req.params;
  const { content, parent_id = null } = req.body;
  const author_id = req.user.id; // Changed from req.body to req.user.id

  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        post_id: postId,
        content,
        author_id,
        parent_id
      }
    ])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ message: 'Comment added', comment: data[0] });
};

exports.replyToComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const author_id = req.user.id; // Changed from req.body to req.user.id

  // First get the parent comment to inherit its post_id
  const { data: parentComment, error: parentError } = await supabase
    .from('comments')
    .select('post_id')
    .eq('id', commentId)
    .single();

  if (parentError) {
    return res.status(404).json({ error: 'Parent comment not found' });
  }

  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        post_id: parentComment.post_id,
        parent_id: commentId,
        content,
        author_id
      }
    ])
    .select();

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json({ message: 'Reply added', reply: data[0] });
};

exports.getRepliesForComment = async (req, res) => {
  const { commentId } = req.params;

  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('parent_id', commentId)
    .order('created_at', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ replies: data });
};

exports.updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const author_id = req.user.id; // Changed from req.body to req.user.id

  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Content cannot be empty' });
  }

  // First, check ownership
  const { data: existingComment, error: findError } = await supabase
    .from('comments')
    .select('author_id')
    .eq('id', commentId)
    .single();

  if (findError) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  if (existingComment.author_id !== author_id) {
    return res.status(403).json({ error: 'Unauthorized — not your comment' });
  }

  const { data, error } = await supabase
    .from('comments')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', commentId)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ message: 'Comment updated', comment: data });
};

exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const author_id = req.user.id; // Changed from req.body to req.user.id

  const { data: existingComment, error: findError } = await supabase
    .from('comments')
    .select('author_id')
    .eq('id', commentId)
    .single();

  if (findError) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  if (existingComment.author_id !== author_id) {
    return res.status(403).json({ error: 'Unauthorized — not your comment' });
  }

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ message: 'Comment deleted successfully' });
};

const nestComments = require('../utils/nestComments');

exports.getCommentsByPost = async (req, res) => {
  const { postId } = req.params;

  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  const nested = nestComments(data);
  res.status(200).json({ comments: nested });
};