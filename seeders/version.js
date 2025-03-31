const projectversion = require('../src/models/boilerplate/projectversion.model');
const Client = require('../src/models/boilerplate/client/clients.model');

async function projectVersionData() {
  try {
    const version = await projectversion.findOne({ versionCode: '0.1', applicationType: 'Android' });
    if (version) {
      return;
    }

    const client = await Client.findOne({ Name: 'porter admin' });
    if (!client) {
      return;
    }

    const VersionData = [
      {
        versionNumber: "Android",
        versionCode: "0.1",
        description: "Test",
        applicationType: "Android",
        clientId: client._id,
      }
    ];

    await projectversion.insertMany(VersionData);
  } catch (err) {
    console.error('Error seeding data:', err);
  }
}

module.exports = projectVersionData;
