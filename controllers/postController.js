const supabase = require('../utils/supabaseClient');

exports.getAllPosts = async (req, res) => {
  const {
    q,
    author,
    tag,
    status,
    sort = 'created_at',
    order = 'desc',
    limit = 10,
    offset = 0
  } = req.query;

  let query = supabase.from('posts').select('*', { count: 'exact' });

  if (q) {
    query = query.or(`title.ilike.%${q}%,content.ilike.%${q}%`);
  }

  if (author) {
    query = query.eq('author_id', author);
  }

  if (tag) {
    query = query.contains('tags', [tag]);
  }

  if (status) {
    query = query.eq('status', status);
  }

  query = query.order(sort, { ascending: order === 'asc' });

  const from = Number(offset);
  const to = from + Number(limit) - 1;

  query = query.range(from, to >= 9999 ? 9999 : to);

  const { data, count, error } = await query;

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({
    total: count,
    results: data.length,
    posts: data
  });
};

exports.createPost = async (req, res) => {
  const { title, content, tags, status, featured_image, category_id, is_featured } = req.body; // Added is_featured here
  const author_id = req.user.id;

  // Add this conversion just before inserting:
  let parsedTags = [];
  if (tags) { // Check if tags exists before processing
      try {
          parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags);
      } catch (e) {
          // If JSON.parse fails, it might be a single string tag or invalid format
          // Decide how to handle this: treat as single tag array or return error
          console.error("Error parsing tags:", e);
          return res.status(400).json({ error: 'Invalid tags format. Must be an array or JSON string array.' });
      }
  }


  const { data, error } = await supabase
    .from('posts')
    .insert([
      {
        title,
        content,
        tags: parsedTags, // ✅ pass real array
        status,
        featured_image,
        author_id,
        category_id,
        is_featured // Added is_featured here
      }
    ])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({ message: 'Post created', post: data });
};

exports.getPostById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return res.status(404).json({ error: 'Post not found' });

  res.status(200).json({ post: data });
};

exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content, tags, status, featured_image, category_id, is_featured = false } = req.body;

  const userId = req.user.id;

  // Ensure 'post' is destructured correctly from the single() call result
  const { data: postData, error: fetchError } = await supabase
    .from('posts')
    .select('author_id')
    .eq('id', id)
    .single(); // Added .single() here to match the check below

  if (fetchError || !postData) { // Use postData here
    return res.status(404).json({ error: 'Post not found' });
  }

  // --- START MODIFICATION ---
  if (postData.author_id !== userId && !req.user.user_metadata?.is_admin) {
    return res.status(403).json({ error: 'You can only edit your own posts' });
  }
  // --- END MODIFICATION ---

  // Handle tags parsing for update as well, similar to createPost
  let parsedTags = [];
  if (tags) {
      try {
          parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags);
      } catch (e) {
          console.error("Error parsing tags for update:", e);
          return res.status(400).json({ error: 'Invalid tags format for update. Must be an array or JSON string array.' });
      }
  }

  const { data, error } = await supabase
    .from('posts')
    .update({ title, content, tags: parsedTags, status, featured_image, category_id, is_featured }) // Use parsedTags here
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ message: 'Post updated', post: data });
};

exports.deletePostById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const { data: post, error: fetchError } = await supabase
    .from('posts')
    .select('author_id')
    .eq('id', id)
    .single();

  if (fetchError || !post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  if (post.author_id !== userId) {
    return res.status(403).json({ error: 'You can only delete your own posts' });
  }

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ message: 'Post deleted successfully' });
};

exports.getPostsByTag = async (req, res) => {
  const { tagName } = req.params;

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .contains('tags', [tagName]); // Ensure 'tags' is a text[] array in Supabase

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({
    total: data.length,
    posts: data
  });
};


exports.getPostsByUser = async (req, res) => {
  const { userId } = req.params;
  const requesterId = req.user.id;

  let query = supabase.from('posts').select('*').eq('author_id', userId);

  // If not the same user, only show published posts
  if (userId !== requesterId) {
    query = query.eq('status', 'published');
  }

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ total: data.length, posts: data });
};

exports.searchPosts = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Search query (q) is required' });
  }

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .or(`title.ilike.%${q}%,content.ilike.%${q}%`);

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({
    total: data.length,
    posts: data
  });
};

exports.getFeaturedPosts = async (req, res) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('is_featured', true);

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({
    total: data.length,
    posts: data
  });
};
exports.getAllTags = async (req, res) => {
  const { data, error } = await supabase
    .from('posts')
    .select('tags');

  if (error) return res.status(500).json({ error: error.message });

  // Flatten and deduplicate all tags
  const allTags = data.flatMap(post => post.tags || []);
  const uniqueTags = [...new Set(allTags)];

  res.status(200).json({ total: uniqueTags.length, tags: uniqueTags });
};
