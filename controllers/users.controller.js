import express from 'express';
import User from './../db/User';

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
  const usersDB = new User();
  res.json({ users: usersDB.list() });
});

export default usersController;
