import express from 'express';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator/check';
import { config, underscoreId } from './../global';
import { User } from '../db/models';
import redisClient from '../redisClient';
import SocketManager from './../SocketManager';

const identityController = express.Router();

identityController.post('/', [
  check('username')
    .exists()
    .withMessage('USERNAME_IS_EMPTY'),
  check('password')
    .exists()
    .withMessage('PASSWORD_IS_EMPTY')
    .isLength({ min: 8 })
    .withMessage('PASSWORD_LENGH_MUST_MORE_THAN_8'),
], async (req, res) => {
  const errorsAfterValidation = validationResult(req);
  // Validate using middleware

  if (!errorsAfterValidation.isEmpty()) {
    res.status(422).json({
      errors: errorsAfterValidation.mapped(),
    });
  } else {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      const isMatchedPassword = user.comparePassword(password);
      if (isMatchedPassword) {
        // Set online to Redis
        redisClient.set(`cmc_OnlineStatus_${user[underscoreId]}`, true);
        // Broadcast online to others except myself
        // const socketManager = new SocketManager();
        // // console.log('========socket id', socketManager.client.id);
        // // console.log(socketManager.client.rooms);
        // socketManager.io.emit('onlineStatus', {
        //   user: {
        //     _id: user[underscoreId],
        //     online: true,
        //   },
        // });
        // Sign token
        const token = jwt.sign({ username }, config.passport.secret, {
          expiresIn: 10000000000000000000,
        });
        res.status(200).json({
          token,
          user,
        });
      } else {
        res.status(401).json({
          code: 401,
          message: 'WRONG_PASSWORD',
        });
      }
    } catch (error) {
      console.log('=======error', error);
      res.status(500).json({
        code: 500,
        message: error.message,
      });
    }
  }
});

export default identityController;
