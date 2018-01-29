import express from 'express';
// import User from './../db/User';
import { User } from '../db/models';
import { errors, pagingDefault } from './../global';

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

usersController.get('/', (req, res) => {
  const skip = req.query.skip || pagingDefault.skip;
  const limit = req.query.limit || pagingDefault.limit;
  User.find().select({ username: 1, email: 1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
    .then((users) => {
      res.status(200).json({
        skip,
        limit,
        data: users,
      });
    })
    .catch(() => {
      res.status(500).json({
        code: 500,
        message: errors.GeneralError.message,
      });
    });
});

export default usersController;
