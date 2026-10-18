import mongoose from 'mongoose';
const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resumePath: { type: String, required: true },
  coverLetter: { type: String, maxlength: 3000, default: '' },
  status: { type: String, enum: ['Submitted', 'Reviewing', 'Shortlisted', 'Rejected'], default: 'Submitted' }
}, { timestamps: true });
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });
export default mongoose.model('Application', applicationSchema);
