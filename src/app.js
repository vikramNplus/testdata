const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const path = require('path');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const { firebase } = require('./config/firebase');


const app = express();


// Set up logging middleware
if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// Set security HTTP headers
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

// Parse JSON request body
app.use(express.json());

// Parse URL-encoded request body
app.use(express.urlencoded({ extended: true }));

// Sanitize request data
// app.use(mongoSanitize());

// Gzip compression
app.use(compression());

// Configure CORS
const corsOptions = {
  origin: '*', 
  // credentials: true,
  methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS', 
  allowedHeaders: 'Content-Type,Authorization',
};
app.use(cors(corsOptions));

// JWT authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// Limit repeated failed requests to auth endpoints in production
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// Static file serving for uploads
app.use('/uploads/categoryImage', express.static(path.join(__dirname, '..', 'uploads/categoryImage')));
app.use('/uploads/vehicles', express.static(path.join(__dirname, '..', 'uploads/vehicles')));
app.use('/uploads/vehicleModels', express.static(path.join(__dirname, '..', 'uploads/vehicleModels')));
app.use('/uploads/user', express.static(path.join(__dirname, '..', 'uploads/user')));
app.use('/uploads/intro', express.static(path.join(__dirname, '..', 'uploads/intro')));
app.use('/uploads/documentImage', express.static(path.join(__dirname, '..', 'uploads/documentImage')));
app.use('/uploads/setting', express.static(path.join(__dirname, '..', 'uploads/setting')));
app.use('/uploads/promo', express.static(path.join(__dirname, '..', 'uploads/promo')));
app.use('/uploads/dispatcher', express.static(path.join(__dirname, '..', 'uploads/dispatcher')));
app.use('/uploads/goods', express.static(path.join(__dirname, '..', 'uploads/goods')));
app.use('/uploads/requestImage',express.static(path.join(__dirname,'..','uploads/requestImage')));
app.use('/uploads/kitImage',express.static(path.join(__dirname,'..','uploads/kitImage')));

// API routes
app.use('/v1', routes);

// Start the server on port 3000
app.listen(3000, () => console.log('Server running on http://localhost:3000'));

// Handle 404 errors for unknown routes
app.use((req, res, next) => {
  next(new ApiError(httpStatus.FORBIDDEN, 'Not found'));
});

// app.use((err, req, res, next) => {
//   res.status(err.status || 500).json({ message: err.message });
// });
// Convert errors to ApiError
app.use(errorConverter);

// Handle errors
app.use(errorHandler);


module.exports = app;
