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
import socket from 'socket.io';
import redisClient from './redisClient';
import { applyPassportStrategy } from './passport';
import { config, underscoreId } from './global';
import SocketManager from './SocketManager';
import { Message } from './db/models';

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


// Listen to Redis

redisClient.on('error', (err) => {
  logger.info('Failed to connect to Redis with ', err);
});

redisClient.on('connect', () => {
  logger.info('Redis works successfully.');
});

const { port, mongoDBUri } = config.env.dev;
const server = app.listen(port, () => {
  logger.info(`Started successfully server at port ${port}`);

  mongoose.connect(mongoDBUri).then(() => {
    logger.info('Conneted to mongoDB at port 27017');
  });
});

// Initialize Socket IO.
const io = socket(server);

// Need to uncomment after.
global.io = io;
// const socketManager = new SocketManager(io); // eslint-disable-line

global.users = {};


io.on('connection', (client) => {
  console.log('Connecting....', client.id);

  client.on('messages-central', (data) => {
    console.log('Messages in server', data);
    // Broad cast to all users.

    if (data.TYPE === 'SEND_MESSAGE') {
      const newMessage = new Message({
        room: data.SENT_TO,
        owner: data.OWNER[underscoreId],
        content: data.currentInput,
      });

      newMessage.save().then((result) => {
        console.log('Save successfully', result);
        const final = result.toObject();
        final.owner = data.OWNER;
        io.sockets.in(data.SENT_TO).emit('newMessages', {
          notice: 'One user just send a message',
          data: final,
        });
      });
    }
  });

  client.on('rooms-central', (data) => {
    if (data.TYPE === 'JOIN_ROOM') {
      // const roomId = data.ROOM_ID;
      client.join(data.ROOM_ID, () => {
        // Boardcast to others not myself
        // client.broadcast.emit(roomId, 'a new user joined this room');
        console.log('Current rooms', client.rooms);
      });
    }
    if (data.TYPE === 'LEAVE_ROOM') {
      // FIXME: implement leave room
    }

    if (data.TYPE === 'SET_ONLINE') {
      const { user } = data;
      user.online = true;
      console.log('=====user', user);

      io.emit('onlineStatus', {
        user,
      });
    }
  });

  client.on('disconnect', () => {
    console.log(client.id, 'disconnected');
  });
});
