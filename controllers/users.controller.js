import express from 'express';
// import User from './../db/User';
import { User } from '../db/models';
import { errors, pagingDefault, underscoreId } from './../global';
import RedisCURD from './../db/RedisCURD';
import redisClient from './../redisClient';

const usersController = express.Router();

/**
 * entry point: /users/:id
 * method: GET
 */
usersController.get('/:id', (req, res) => {
  res.send(`Get user with id is: ${req.params.id}`);
});

/**
 * entry point: /users
 * method: GET
 */

const updateUserOnline = (user, redisCURD) => {
  const currentUser = user;
  const onlineRedisKey = `cmc_OnlineStatus_${user[underscoreId]}`;
  return new Promise((resolve, reject) => {
    redisCURD.get(onlineRedisKey).then((value) => {
      currentUser.online = value === 'true' || false;
      resolve(currentUser);
    }).catch((err) => {
      reject(err);
    });
  });
};

usersController.get('/', (req, res) => {
  const skip = req.query.skip || pagingDefault.skip;
  const limit = req.query.limit || pagingDefault.limit;
  const redisCURD = new RedisCURD(redisClient);
  User.find().select({ username: 1, email: 1, avatar: 1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
    .then((users) => {
      // Get users with online status
      const promies = [];
      for (let i = 0; i < users.length; i += 1) {
        promies.push(updateUserOnline(users[i], redisCURD));
      }
      Promise.all(promies).then((finalUsers) => {
        res.status(200).json({
          skip,
          limit,
          data: finalUsers,
        });
      }).catch((err) => {
        res.status(500).json({
          code: 500,
          message: err.message,
        });
      });
    });
});

export default usersController;
