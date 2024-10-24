import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Access denied' });
    }
    next();
  };
  
