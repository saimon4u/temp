import jwt from 'jsonwebtoken';
import User from '../models/User.js';

class AuthController {
  static async signUp(req, res) {
    try {
      const { email, password, role } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      const user = new User({ email, password, role: role || 'user' });
      await user.save();
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
      res.status(201).json({ message: 'User registered successfully', userId: user._id, token, role: user.role });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
      res.status(200).json({ message: 'Login successful', userId: user._id, token, role: user.role });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

export default AuthController;