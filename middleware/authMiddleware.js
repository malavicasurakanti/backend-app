import { verify } from "jsonwebtoken";
import User from "../models/User";
export const authGuard = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }
      next();
    } catch (error) {
      console.error("Token verification error:", error.message);
      res.status(401).json({ message: "Not authorized, Token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, No token" });
  }
};
export const adminGuard = (req, res, next) => {
  if (req.user && req.user.admin) {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as an admin" });
  }
};