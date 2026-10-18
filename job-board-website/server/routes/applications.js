import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import { protect, allowRoles } from '../middleware/auth.js';
import { sendApplicationEmail } from '../utils/email.js';
const router = Router();
const uploadDir = path.resolve('uploads'); fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({ destination: (_req, _file, cb) => cb(null, uploadDir), filename: (req, file, cb) => cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname).toLowerCase()}`) });
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (_req, file, cb) => { const ext = path.extname(file.originalname).toLowerCase(); if (['.pdf', '.doc', '.docx'].includes(ext)) cb(null, true); else cb(new Error('Resume must be PDF, DOC or DOCX.')); } });
router.post('/:jobId', protect, allowRoles('candidate'), upload.single('resume'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please attach a resume (PDF, DOC or DOCX, max 5 MB).' });
    const job = await Job.findById(req.params.jobId).populate('employer', 'email');
    if (!job) { fs.unlinkSync(req.file.path); return res.status(404).json({ message: 'Job not found.' }); }
    try {
      const application = await Application.create({ job: job._id, candidate: req.user._id, resumePath: `/uploads/${req.file.filename}`, coverLetter: req.body.coverLetter || '' });
      await sendApplicationEmail(req.user.email, job.title).catch(err => console.error('Email error:', err.message));
      res.status(201).json({ message: 'Application submitted successfully.', application });
    } catch (e) { fs.unlinkSync(req.file.path); if (e.code === 11000) return res.status(409).json({ message: 'You have already applied for this job.' }); throw e; }
  } catch (e) { next(e); }
});
router.get('/mine/list', protect, allowRoles('candidate'), async (req, res, next) => {
  try { const applications = await Application.find({ candidate: req.user._id }).populate('job').sort({ createdAt: -1 }); res.json({ applications }); } catch (e) { next(e); }
});
router.get('/employer/list', protect, allowRoles('employer'), async (req, res, next) => {
  try { const jobs = await Job.find({ employer: req.user._id }).select('_id title'); const applications = await Application.find({ job: { $in: jobs.map(j => j._id) } }).populate('job', 'title').populate('candidate', 'name email').sort({ createdAt: -1 }); res.json({ applications }); } catch (e) { next(e); }
});
router.patch('/:id/status', protect, allowRoles('employer'), async (req, res, next) => {
  try { const app = await Application.findById(req.params.id).populate('job'); if (!app || String(app.job.employer) !== String(req.user._id)) return res.status(404).json({ message: 'Application not found.' }); const allowed = ['Reviewing', 'Shortlisted', 'Rejected']; if (!allowed.includes(req.body.status)) return res.status(400).json({ message: 'Invalid application status.' }); app.status = req.body.status; await app.save(); res.json({ application: app }); } catch (e) { next(e); }
});
export default router;
