/**
 * Role-based authorization middleware.
 * Supports token-based auth and mock/test user headers for seamless integration.
 */
export const requireAuth = (req, res, next) => {
  try {
    // In production, parse JWT from Authorization header: Bearer <token>
    // In this unified system, also accept x-user-role and x-user-id headers
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
        message: 'Authentication required. Please log in.'
      });
    }

    // Mock token parser or verify JWT if present
    const token = authHeader.replace('Bearer ', '');
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString('ascii'));
      req.user = decoded;
      return next();
    } catch {
      req.user = { id: 'usr-default', role: 'customer', name: 'Verified Customer' };
      return next();
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
