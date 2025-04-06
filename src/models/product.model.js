const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: 'text'
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String,
    required: true
  },
  price: Number,
  unit: {
    type: String,
    enum: ['kg', 'dozen', 'piece']
  },
  stock: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true 
  },
  description: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: true
},
}, { timestamps: true });

productSchema.plugin(toJSON);
productSchema.plugin(paginate);

module.exports = mongoose.model('Product', productSchema);