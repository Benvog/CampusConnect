import { Request, Response, NextFunction } from 'express';
import { getUserFromToken } from '../services/authService';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        profile?: any;
      };
    }
  }
}

// Middleware to protect routes
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header: "Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    
    // DEV ONLY: Allow dev tokens to bypass verification
    if (token.startsWith('dev-')) {
      req.user = {
        id: 'dev-user-id',
        email: 'dev@campusconnect.test',
        profile: { is_email_verified: true }
      };
      return next();
    }
    
    // Verify token and get user
    const user = await getUserFromToken(token);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

// Optional: Check if email is verified
export const requireVerifiedEmail = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.profile?.is_email_verified) {
    return res.status(403).json({
      success: false,
      error: 'Email verification required'
    });
  }
  next();
};
