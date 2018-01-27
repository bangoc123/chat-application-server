import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import logger from 'morgan';

import {
  usersController,
  messagesController,
  dashboardController,
  signupController,
  loginController,
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
}));

// Set up morgan for logging

app.use(logger('combined'));

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

const port = 8000;
app.listen(port, () => { console.log(`Listening on ${port}`); });
