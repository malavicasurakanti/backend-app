// controllers/authController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const generateToken = (userId) => {
  const payload = { id: userId };
  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: '1h' };

  return jwt.sign(payload, secret, options);
};
