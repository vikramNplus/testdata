const Role = require('../src/models/boilerplate/role.model');

const RoleData = [
  {
    role: 'superadmin',
  },
  {
    role: 'client',
  }
];

async function roleData() {
  const getRole = await Role.find();
  if (getRole.length > 0) {
    console.log('Roles already exist. Skipping seeding.');
    return;
  }
  try {
    await Role.insertMany(RoleData);
    console.log('Role data seeded successfully!');
  } catch (err) {
    console.error('Error seeding data:', err);
  }
}

module.exports = roleData;