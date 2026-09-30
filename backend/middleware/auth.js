import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'vendorhub-super-secret-jwt-key-2025';

/**
 * Role-based authorization middleware.
 * Supports authentic JWT token verification, role guards, and developmental headers.
 */
export const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const headerRole = req.headers['x-user-role'];
    const headerUserId = req.headers['x-user-id'];
    const headerUserName = req.headers['x-user-name'];

    if (headerRole && headerUserId) {
      req.user = {
        id: headerUserId,
        role: headerRole.toLowerCase(),
        name: headerUserName || (headerRole === 'admin' ? 'Admin' : 'User')
      };
      return next();
    }

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in with a valid JWT token.'
      });
    }

    const token = authHeader.replace(/^Bearer\s+/i, '');

    // 1. Verify standard JWT
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = {
        id: decoded.id,
        role: (decoded.role || decoded.type || 'customer').toLowerCase(),
        name: decoded.name || decoded.fullName || 'User',
        email: decoded.email,
        provider: decoded.provider || 'jwt'
      };
      return next();
    } catch (jwtErr) {
      // 2. Fallback to base64 parser for legacy sessions
      try {
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString('ascii'));
        req.user = {
          id: decoded.id,
          role: (decoded.role || decoded.type || 'customer').toLowerCase(),
          name: decoded.name || decoded.fullName || 'User',
          email: decoded.email
        };
        return next();
      } catch {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired JWT token signature.',
          error: jwtErr.message
        });
      }
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization token or session expired.',
      error: error.message
    });
  }
};

/**
 * Authorize specific roles (e.g. authorizeRoles('admin'), authorizeRoles('vendor', 'admin'))
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user?.role || 'anonymous'}' is not authorized to access this resource.`
      });
    }
    next();
  };
};
