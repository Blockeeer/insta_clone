// Format date to relative time (e.g., "2 hours ago")
function formatRelativeTime(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return `${weeks}w`;
}

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate username format (alphanumeric, underscores, 3-30 chars)
function isValidUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  return usernameRegex.test(username);
}

// Validate password strength (min 6 chars)
function isValidPassword(password) {
  return password && password.length >= 6;
}

// Sanitize user object (remove sensitive fields)
function sanitizeUser(user) {
  const { password, ...sanitized } = user;
  return sanitized;
}

// Pagination helper
function getPaginationParams(query) {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

module.exports = {
  formatRelativeTime,
  isValidEmail,
  isValidUsername,
  isValidPassword,
  sanitizeUser,
  getPaginationParams
};
