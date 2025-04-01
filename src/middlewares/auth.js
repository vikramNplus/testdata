const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate')); // JWT not valid
  }

  req.user = user;

  // Set the user role in the request object (to be used for authorization)
  req.user.role = user.role;

  // Check if the user has the required rights
  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));

    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden')); // Insufficient rights
    }
  }

  resolve();
};

const auth = (...requiredRights) => async (req, res, next) => {
  console.log('Required Rights:', requiredRights);
  console.log('Authorization Header:', req.headers.authorization);  // Log the Authorization header to check the token

  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
  })
    .then(() => next()) // Call the next middleware/route handler
    .catch((err) => next(err)); // Catch errors and pass to error handler
};

module.exports = auth;
