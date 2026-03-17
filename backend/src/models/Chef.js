const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const chefSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, default: 'chef' },
    location: String,
    experience: String,
    bio: String,
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    idProof: String,
    kitchenPhotos: [String],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

chefSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

chefSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('Chef', chefSchema);
