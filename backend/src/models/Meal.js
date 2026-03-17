const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity_g: { type: Number, required: true },
});

const nutritionSchema = new mongoose.Schema({
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
});

const mealSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: String,
    dietCategory: {
      type: String,
      enum: ['Weight Loss', 'Muscle Gain', 'Diabetic Friendly', 'Healthy Living'],
      required: true,
    },
    chefId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef', required: true },
    ingredients: [ingredientSchema],
    nutrition: nutritionSchema,
    image: String,
    price: { type: Number, required: true, default: 150 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: String,
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Meal', mealSchema);
