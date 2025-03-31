const mongoose = require('mongoose');
const Country = require('./country');
const Language = require('./language');
const Role = require('./role');
const Superadmin = require('./superadmin');
const Clientadmin = require('./clientadmin');
const CompanySubScription = require('./companySubscription');
const Documents = require('./documents');
const ProjectVersion = require('./version');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

const runSeeders = async () => {
  try {
    await Country();
    await Language();
    await Role();
    await Superadmin();
    await Clientadmin();
    await ProjectVersion();

    console.log('All seeders completed!');
  } catch (err) {
    console.error('Error running seeders:', err);
  } finally {
    mongoose.disconnect().then(() => {
      console.log('Disconnected from MongoDB');
      process.exit();
    });
  }
};

runSeeders();