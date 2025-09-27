import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide your full name.'],
    maxlength: [60, 'Full name cannot be more than 60 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    unique: true, // Every email must be unique
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address.',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

// Mongoose's way of preventing model re-compilation in Next.js dev environment
export default mongoose.models.User || mongoose.model('User', UserSchema);