const Language = require('../src/models/boilerplate/languages.model');

const LanguageData = [
  {
    name: "en",
    code: "en",
    clientId: "67a1daea0f775d0dac7ab2c2",
    status: true
  },
  {
    name: "fr",
    code: "fr",
    clientId: "67a1daea0f775d0dac7ab2c2",
    status: true
  },
  {
    name: "ar",
    code: "ar",
    clientId: "67a1daea0f775d0dac7ab2c2",
    status: true
  }
];

async function languageData() {
  const getLanguage = await Language.find();

  if (getLanguage.length > 0) {
    console.log('Language already exist. Skipping seeding.');
    return;
  }
  try {
    await Language.insertMany(LanguageData);
    console.log('Language data seeded successfully!');
  } catch (err) {
    console.error('Error seeding data:', err);
  }
}

module.exports = languageData;