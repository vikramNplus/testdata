const mongoose = require('mongoose');


const CartSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index to make finding the cart item faster
CartSchema.index({ customer: 1, product: 1 }, { unique: true });

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;
