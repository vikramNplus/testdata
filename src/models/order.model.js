// order.model.js
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId, // Reference to the Product model
          ref: 'Product', // Make sure it refers to the 'Product' model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['placed', 'delivered', 'cancelled'],
      default: 'placed',
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = { Order };
