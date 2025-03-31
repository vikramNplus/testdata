const User = require('../src/models/boilerplate/users.model');
const Client = require('../src/models/boilerplate/client/clients.model');
const Subscription = require('../src/models/boilerplate/subscription/companySubscription.model');
const Role = require('../src/models/boilerplate/role.model');
const Country = require('../src/models/boilerplate/country.model');
const Language = require('../src/models/boilerplate/languages.model');
require('dotenv').config();
const bcrypt = require('bcryptjs');

async function adminData() {
  try {
    const clientAdminRole = await Role.findOne({ role: 'client' });
    if (!clientAdminRole) {
      throw new Error('Client role not found. Please ensure it exists in the Role collection.');
    }

    const countryData = await Country.findOne({ name: 'India' });
    if (!countryData) {
      throw new Error('Country not found. Please ensure it exists in the Country collection.');
    }

    const existingUser = await User.findOne({ email: "porter@admin.com" });
    if (existingUser) {
      console.log('Porteradmin user already exists. Skipping seeding.');
      return;
    }

    const languageData = await Language.findOne({ name: 'en' });
    if (!languageData) {
      throw new Error('Language not found. Please ensure it exists in the Language collection.');
    }

    const subscriptionData = await Subscription.findOne({ name: "Platinum" });
    if (!subscriptionData) {
      throw new Error('Subscription not found. Please ensure it exists in the Subscription collection.');
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + subscriptionData.validityPeriod);

    const userData = {
      firstName: "porter",
      lastName: "admin",
      email: "porter@admin.com",
      phoneNumber: "0987654321",
      roleIds: [clientAdminRole._id],  
      language: languageData._id,   
      countryCode: countryData.countryCode, 
      country: countryData._id,
      password: "admin@123",
    };
    const hashedPassword = await bcrypt.hash(userData.password, 8); // 8 is the salt rounds
    userData.password = hashedPassword;

    // Save the user to the database
    const newUser = new User(userData);
    await newUser.save();
    console.log(`User ${userData.email} has been seeded successfully.`);

    const existingClient = await Client.findOne({ name: "porter admin" });
    if (existingClient) {
      console.log('Client user already exists. Skipping seeding.');
      return;
    }

    const clientData = {
      userId: newUser._id,
      Name: "porter admin",
      subScriptionId: subscriptionData._id,
      noOfDrivers: subscriptionData.noOfDrivers,
      noOfUsers: subscriptionData.noOfUsers,
      clientCode: "007",
      StartDate: startDate,
      EndDate: endDate
    };

    await new Client(clientData).save();
    console.log('Client data seeded successfully!');

  } catch (err) {
    console.error('Error seeding data:', err);
  }
}

module.exports = adminData;