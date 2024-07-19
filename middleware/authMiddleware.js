import pkg from 'jsonwebtoken';
const { verify } = pkg;
import User from "../models/User.js";

export const authGuard = async (req, res, next) => {
  console.log('Request Method:', req.method);
  console.log('Authorization Header:', req.headers.authorization);

  // Allow OPTIONS requests to pass through
  if (req.method === 'OPTIONS') {
    return next();
  }

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      console.log('Token:', token);
      const { id } = verify(token, process.env.JWT_SECRET);
      console.log('User ID from Token:', id);
      req.user = await User.findById(id).select('-password');
      if (!req.user) {
        throw new Error('User not found');
      }
      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      let err = new Error('Not authorized, Token failed');
      err.statusCode = 401;
      next(err);
    }
  } else {
    let error = new Error('Not authorized, No token');
    error.statusCode = 401;
    next(error);
  }
};

export const adminGuard = (req, res, next) => {
  if (req.user && req.user.admin) {
    next();
  } else {
    let error = new Error("Not authorized as an admin");
    error.statusCode = 401;
    next(error);
  }
};
