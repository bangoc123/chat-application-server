import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import morgan from 'morgan';
import mongoose from 'mongoose';
import logger from 'winston';
import flash from 'express-flash';
import passport from 'passport';
import swaggerTools from 'swagger-tools';
import cors from 'cors';
import { applyPassportStrategy } from './passport';
import { config } from './global';

import {
  usersController,
  messagesController,
  dashboardController,
  signupController,
  loginController,
  roomsController,
  identityController,
} from './controllers';

const swaggerDoc = require('./swagger.json');

const app = express();

// Set up view engine

app.set('view engine', 'ejs');

// Set up bodyParser

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

// Set up public folder for serving static files

app.use(express.static('public'));

// Set up session
app.use(session({
  secret: 'cmc nodejs training',
  resave: true,
  saveUninitialized: true,
}));

// Set up flash message
app.use(flash());

// Initialize passport to use

app.use(passport.initialize());

// Apply strategy to passport

applyPassportStrategy(passport);

// Set up morgan for logging

app.use(morgan('dev'));

/**
  Index Entry Point
 */
app.get('/', (req, res) => {
  res.render('index');
});

// Set up swagger

const options = {
  swaggerUi: '/swagger.json',
  controllers: './controllers',
};

// Set up CORS 

app.use(cors());

swaggerTools.initializeMiddleware(swaggerDoc, (middleware) => {
  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());
});

// Set up controller
app.use('/users', usersController);
app.use('/messages', messagesController);
app.use('/dashboard', dashboardController);
app.use('/signup', signupController);
app.use('/login', loginController);
app.use('/rooms', roomsController);
app.use('/identity', identityController);

const { port, mongoDBUri } = config.env.dev;
app.listen(port, () => {
  logger.info(`Stated successfully server at port ${port}`);
  mongoose.connect(mongoDBUri).then(() => {
    logger.info('Conneted to mongoDB at port 27017');
  });
});
