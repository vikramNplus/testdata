const User = require('../src/models/boilerplate/users.model');
const Role = require('../src/models/boilerplate/role.model');
const Country = require('../src/models/boilerplate/country.model');
const Language = require('../src/models/boilerplate/languages.model');
require('dotenv').config();
const bcrypt = require('bcryptjs');

async function adminData() {
  try {
    const superAdminRole = await Role.findOne({ role: 'Superadmin' });
    if (!superAdminRole) {
      throw new Error('Superadmin role not found. Please ensure it exists in the Role collection.');
    }

    const countryData = await Country.findOne({ name: 'India' });
    if (!countryData) {
      throw new Error('Country not found. Please ensure it exists in the Country collection.');
    }

    const existingUser = await User.findOne({ email: "super@admin.com" });
    if (existingUser) {
      return;
    }

    const LanguageData = await Language.findOne({ name: 'en' });
    if (!LanguageData) {
      throw new Error('Language not found. Please ensure it exists in the Language collection.');
    }

    const UserData = [
      {
        firstName: "superadmin",
        lastName: "kumar",
        email: "super@admin.com",
        phoneNumber: "123456789",
        roleIds: [superAdminRole._id],  // Using the dynamic role ID
        language: LanguageData._id,   // Using the dynamic language ID
        countryCode: "+91", // Using the dynamic country ID
        country: countryData._id,
        password: "admin@123"           // Default password
      }
    ];

    for (const user of UserData) {
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(user.password, 8); // 10 is the salt rounds
      user.password = hashedPassword;

      // Save the user to the database
      const newUser = new User(user);
      await newUser.save();
      console.log(`User ${user.email} has been seeded successfully.`);
    }
  } catch (err) {
    console.error('Error seeding data:', err);
  }
}

module.exports = adminData;