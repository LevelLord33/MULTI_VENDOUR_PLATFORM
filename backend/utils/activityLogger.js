import mongoose from 'mongoose';
import PlatformActivityLog from '../models/PlatformActivityLog.js';

const isDbReady = () => mongoose.connection.readyState === 1;

// In-memory fallback logs for offline resilience
const memLogs = [];

/**
 * Log a platform activity event safely.
 * Strips any sensitive credentials (passwords, JWTs, secrets).
 */
export const logActivity = async ({
  action,
  actorId = 'system',
  actorRole = 'system',
  actorName = 'System',
  targetType,
  targetId = '',
  title,
  details = {}
}) => {
  try {
    // Sanitize details: remove sensitive fields
    const sanitizedDetails = { ...details };
    delete sanitizedDetails.password;
    delete sanitizedDetails.token;
    delete sanitizedDetails.jwt;
    delete sanitizedDetails.secret;
    delete sanitizedDetails.TWILIO_AUTH_TOKEN;
    delete sanitizedDetails.TWILIO_API_SECRET;
    delete sanitizedDetails.RAZORPAY_KEY_SECRET;

    const logEntry = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      action,
      actorId,
      actorRole,
      actorName,
      targetType,
      targetId,
      title: title || `${action.replaceAll('_', ' ')}`,
      details: sanitizedDetails,
      timestamp: new Date()
    };

    if (isDbReady()) {
      try {
        await PlatformActivityLog.create(logEntry);
      } catch (e) {
        console.warn('MongoDB activity log write failed, using mem:', e.message);
        memLogs.unshift(logEntry);
      }
    } else {
      memLogs.unshift(logEntry);
      if (memLogs.length > 500) memLogs.pop();
    }

    return logEntry;
  } catch (err) {
    console.error('Error logging platform activity:', err.message);
    return null;
  }
};

export const getInMemoryLogs = () => [...memLogs];
