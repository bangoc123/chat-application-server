import express from 'express';

const messagesController = express.Router();

/**
 * entry point: /messages/:id
 * method: GET
 */
messagesController.get('/:id', (req, res) => {
  res.send(`Get message with id is: ${req.params.id}`);
});

/**
 * entry point: /messages
 * method: GET
 */

messagesController.get('/', (req, res) => {
  res.send('Get all messages');
});

export default messagesController;
