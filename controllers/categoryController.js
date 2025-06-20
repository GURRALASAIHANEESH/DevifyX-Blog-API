const supabase = require('../utils/supabaseClient');

exports.getAllCategories = async (req, res) => {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ total: data.length, categories: data });
};

exports.createCategory = async (req, res) => {
  const { name, description } = req.body;
  const user = req.user;

  if (!user || !user.user_metadata?.is_admin) {
    return res.status(403).json({ error: 'Only admins can create categories' });
  }

  const { data, error } = await supabase
    .from('categories')
    .insert([{ name, description }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ message: 'Category created', category: data });
};

exports.getPostsByCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('category_id', categoryId);

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ total: data.length, posts: data });
};
exports.getPostsByCategory = async (req, res) => {
  const { categoryId } = req.params;

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('category_id', categoryId);

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({
    total: data.length,
    posts: data
  });
};