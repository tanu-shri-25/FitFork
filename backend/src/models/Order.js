const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    chefId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef', required: true },
    mealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal', required: true },
    quantity: { type: Number, default: 1 },
    totalPrice: Number,
    deliveryAddress: String,
    status: {
      type: String,
      enum: ['placed', 'accepted', 'preparing', 'ready', 'delivered', 'cancelled'],
      default: 'placed',
    },
    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
