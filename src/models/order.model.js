const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const orderSchema = mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: Number
  }],
  status: {
    type: String,
    enum: ['placed', 'delivered', 'cancelled'],
    default: 'placed'
  }
}, { timestamps: true });

orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

module.exports = mongoose.model('Order', orderSchema);