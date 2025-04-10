const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const paginate = require('./plugins/paginate.plugin'); 

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


const Product = mongoose.model('Product', productSchema);

module.exports = { Product };