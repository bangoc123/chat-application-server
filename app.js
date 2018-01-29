import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import morgan from 'morgan';
import mongoose from 'mongoose';
import logger from 'winston';
import flash from 'express-flash';

import {
  usersController,
  messagesController,
  dashboardController,
  signupController,
  loginController,
  roomsController,
} from './controllers';

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

// Set up morgan for logging

app.use(morgan('dev'));

/**
  Index Entry Point
 */
app.get('/', (req, res) => {
  res.render('index');
});

// Set up controller
app.use('/users', usersController);
app.use('/messages', messagesController);
app.use('/dashboard', dashboardController);
app.use('/signup', signupController);
app.use('/login', loginController);
app.use('/rooms', roomsController);

const port = 8000;
const mongoDBUri = 'mongodb://localhost/cmc';
app.listen(port, () => {
  logger.info(`Stated successfully server at port ${port}`);
  mongoose.connect(mongoDBUri).then(() => {
    logger.info('Conneted to mongoDB at port 27017');
  });
});
