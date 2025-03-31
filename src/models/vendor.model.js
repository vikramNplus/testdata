const mongoose = require('mongoose');

const { User } = require('./user.model');

const vendorSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true
  },
  govtId: {
    type: String,
    required: true
  },
  serviceAreas: [{
    pincode: String,
    deliveryRadius: Number // in km
  }],
  assignedWarehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse'
  },
  rating: {
    type: Number,
    default: 0
  }
});

module.exports = User.discriminator('vendor', vendorSchema);