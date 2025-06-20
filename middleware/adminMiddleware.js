module.exports = function isAdminOnly(req, res, next) {
  const user = req.user;

  if (!user || !user.user_metadata?.is_admin) {
    return res.status(403).json({ error: 'Admin access only' });
  }

  next();
};
