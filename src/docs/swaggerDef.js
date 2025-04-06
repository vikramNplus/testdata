const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'node-express',
    version,
  
  },
  servers: [
    {
      url: `https://testdata-x7qx.onrender.com/v1`,
    },
  ],
};

module.exports = swaggerDef;
