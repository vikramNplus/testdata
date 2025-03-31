const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const customerRoute = require('./customer.route');

const docsRoute = require('./docs.route');
const config = require('../../config/config');
require('../../services');

const router = express.Router();


const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/api/auth',
    route: authRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/customer',
    route: customerRoute,
  }

];
const devRoutes = [
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
