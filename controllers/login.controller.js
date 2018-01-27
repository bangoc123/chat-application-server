import express from 'express';

const loginController = express.Router();

/**
 * entry point: /login
 * method: GET
 */
loginController.get('/', (req, res) => {
  res.send('Get login page');
});

export default loginController;
