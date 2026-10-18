import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
const router = Router();
const publicUser = u => ({ id: u._id, name: u.name, email: u.email, role: u.role, company: u.company, bio: u.bio });
const makeToken = u => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role, company } = req.body;
    if (!name || !email || !password || !['candidate', 'employer'].includes(role)) return res.status(400).json({ message: 'Name, email, password and valid role are required.' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must contain at least 8 characters.' });
    if (role === 'employer' && !company?.trim()) return res.status(400).json({ message: 'Company name is required for employer accounts.' });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ message: 'An account with this email already exists.' });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 12), role, company: role === 'employer' ? company : '' });
    res.status(201).json({ token: makeToken(user), user: publicUser(user) });
  } catch (e) { next(e); }
});
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || '').toLowerCase() }).select('+password');
    if (!user || !await bcrypt.compare(password || '', user.password)) return res.status(401).json({ message: 'Incorrect email or password.' });
    res.json({ token: makeToken(user), user: publicUser(user) });
  } catch (e) { next(e); }
});
router.get('/me', protect, (req, res) => res.json({ user: publicUser(req.user) }));
export default router;
