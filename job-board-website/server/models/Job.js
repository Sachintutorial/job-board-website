import mongoose from 'mongoose';
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  company: { type: String, required: true, trim: true, maxlength: 100 },
  location: { type: String, required: true, trim: true, maxlength: 100 },
  type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'], default: 'Full-time' },
  salary: { type: String, trim: true, maxlength: 80, default: 'Not disclosed' },
  description: { type: String, required: true, maxlength: 10000 },
  requirements: { type: String, maxlength: 5000, default: '' },
  featured: { type: Boolean, default: false },
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
jobSchema.index({ title: 'text', company: 'text', location: 'text', description: 'text' });
export default mongoose.model('Job', jobSchema);
