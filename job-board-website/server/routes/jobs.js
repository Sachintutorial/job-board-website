import { Router } from 'express';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import { protect, allowRoles } from '../middleware/auth.js';
const router = Router();
router.get('/', async (req, res, next) => {
  try {
    const { q, location, type, featured } = req.query;
    const filter = {};
    if (q) filter.$or = ['title', 'company', 'location', 'description'].map(k => ({ [k]: { $regex: String(q).slice(0, 100), $options: 'i' } }));
    if (location) filter.location = { $regex: String(location).slice(0, 100), $options: 'i' };
    if (type && type !== 'All types') filter.type = type;
    if (featured === 'true') filter.featured = true;
    const jobs = await Job.find(filter).populate('employer', 'name company').sort({ createdAt: -1 }).limit(100);
    res.json({ jobs });
  } catch (e) { next(e); }
});
router.get('/:id', async (req, res, next) => {
  try { const job = await Job.findById(req.params.id).populate('employer', 'name company'); if (!job) return res.status(404).json({ message: 'Job not found.' }); res.json({ job }); } catch (e) { next(e); }
});
router.post('/', protect, allowRoles('employer'), async (req, res, next) => {
  try {
    const { title, company, location, type, salary, description, requirements, featured } = req.body;
    if (![title, company, location, description].every(v => typeof v === 'string' && v.trim())) return res.status(400).json({ message: 'Title, company, location and description are required.' });
    const job = await Job.create({ title, company, location, type, salary, description, requirements, featured: Boolean(featured), employer: req.user._id });
    res.status(201).json({ job });
  } catch (e) { next(e); }
});
router.put('/:id', protect, allowRoles('employer'), async (req, res, next) => {
  try { const job = await Job.findOne({ _id: req.params.id, employer: req.user._id }); if (!job) return res.status(404).json({ message: 'Job not found or not owned by you.' }); Object.assign(job, req.body); await job.save(); res.json({ job }); } catch (e) { next(e); }
});
router.delete('/:id', protect, allowRoles('employer'), async (req, res, next) => {
  try { const job = await Job.findOneAndDelete({ _id: req.params.id, employer: req.user._id }); if (!job) return res.status(404).json({ message: 'Job not found or not owned by you.' }); await Application.deleteMany({ job: job._id }); res.json({ message: 'Job deleted.' }); } catch (e) { next(e); }
});
export default router;
