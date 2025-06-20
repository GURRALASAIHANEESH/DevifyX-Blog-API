const supabase = require('../utils/supabaseClient');

exports.togglePostLike = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.postId;

  // Check if user already liked the post
  const { data: existing, error: checkError } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .maybeSingle();

  if (checkError) return res.status(500).json({ error: checkError.message });

  if (existing) {
    // Unlike
    const { error: deleteError } = await supabase
      .from('likes')
      .delete()
      .eq('id', existing.id);

    if (deleteError) return res.status(500).json({ error: deleteError.message });

    return res.status(200).json({ message: 'Post unliked' });
  } else {
    // Like
    const { error: insertError } = await supabase
      .from('likes')
      .insert([{ user_id: userId, post_id: postId }]);

    if (insertError) return res.status(500).json({ error: insertError.message });

    return res.status(201).json({ message: 'Post liked' });
  }
};

exports.getPostLikes = async (req, res) => {
  const postId = req.params.postId;

  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true }) // Efficient count
    .eq('post_id', postId);

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ likes: count });
};
exports.likeOrUnlikePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  const { data: existing, error } = await supabase
    .from('likes')
    .select('*')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });

  if (existing) {
    await supabase.from('likes').delete().eq('id', existing.id);
    return res.status(200).json({ message: 'Post unliked' });
  } else {
    const { error: insertError } = await supabase
      .from('likes')
      .insert({ post_id: postId, user_id: userId });

    if (insertError) return res.status(500).json({ error: insertError.message });

    return res.status(201).json({ message: 'Post liked' });
  }
};
exports.likeOrUnlikeComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  const { data: existing, error } = await supabase
    .from('likes')
    .select('*')
    .eq('comment_id', commentId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });

  if (existing) {
    await supabase.from('likes').delete().eq('id', existing.id);
    return res.status(200).json({ message: 'Comment unliked' });
  } else {
    const { error: insertError } = await supabase
      .from('likes')
      .insert({ comment_id: commentId, user_id: userId });

    if (insertError) return res.status(500).json({ error: insertError.message });

    return res.status(201).json({ message: 'Comment liked' });
  }
};
exports.getCommentLikes = async (req, res) => {
  const { commentId } = req.params;

  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true }) // head:true gets only metadata
    .eq('comment_id', commentId);

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ likes: count });
};
