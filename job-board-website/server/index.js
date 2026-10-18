import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';
import applicationRoutes from './routes/applications.js';
const app = express();
const port = process.env.PORT || 5000;
if (!process.env.JWT_SECRET) { console.error('JWT_SECRET is required. Set it in server/.env'); process.exit(1); }
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(path.resolve('uploads')));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }), authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use((err, _req, res, _next) => { console.error(err); const status = err.name === 'ValidationError' ? 400 : err.name === 'CastError' ? 400 : err.code === 11000 ? 409 : 500; res.status(status).json({ message: status === 500 ? (err.message || 'Server error') : err.message }); });
try { await mongoose.connect(process.env.MONGO_URI, { tlsAllowInvalidCertificates: true }); console.log('MongoDB connected'); app.listen(port, '0.0.0.0', () => console.log(`http://localhost:${port}`)); } catch (err) { console.error('MongoDB connection failed:', err.message); process.exit(1); }
