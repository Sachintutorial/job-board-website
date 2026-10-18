import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: ['candidate', 'employer'], required: true },
  company: { type: String, trim: true, maxlength: 100, default: '' },
  bio: { type: String, maxlength: 1000, default: '' }
}, { timestamps: true });
export default mongoose.model('User', userSchema);
