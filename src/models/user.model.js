const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,  
    },
    email: {
      type: String,
      required: true,  
      unique: true,
      lowercase: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Invalid email address',
      },
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => validator.isMobilePhone(v),
        message: 'Invalid phone number',
      },
    },
    password: {
      type: String,
      private: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ['customer', 'vendor', 'admin'],
      required: true,
    },
    otp: {
      code: { type: String }, // OTP code
      expiresAt: { type: Date }, // OTP expiry time
      sentAt: { type: Date }, // OTP sent time
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  });

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

// Check if phone number is taken
userSchema.statics.isPhoneTaken = async function (phoneNumber, excludeUserId) {
  const user = await this.findOne({ phoneNumber, _id: { $ne: excludeUserId } });
  return !!user;
};

// Password hashing
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = { User };
