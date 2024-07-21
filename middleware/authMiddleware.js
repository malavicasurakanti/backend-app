import { verify } from "jsonwebtoken";
import User from "../models/User";

export const authGuard = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, No token provided" });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Not authorized, Invalid token" });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Not authorized, Token expired" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const adminGuard = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized, No user found" });
  }
  
  if (req.user.admin) {
    next();
  } else {
    res.status(403).json({ message: "Forbidden, Not authorized as an admin" });
  }
};
