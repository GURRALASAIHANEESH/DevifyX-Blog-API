const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async function authenticateUser(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  console.log("💬 Incoming Auth Header:", req.headers.authorization);
  console.log("🔑 Extracted token:", token);

  if (!token) {
    return res.status(401).json({ error: 'Access token missing!' });
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    console.error("❌ Invalid token or error:", error);
    return res.status(401).json({ error: 'Invalid or expired token!' });
  }

  req.user = data.user;
  req.token = token;

  console.log("✅ Authenticated user:", data.user.email);

  next();
};
