import express from 'express';
import { Message } from '../db/models';
import { pagingDefault, errors } from '../global';

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

messagesController.get('/', async (req, res) => {
  const { query } = req;
  const skip = query.skip || pagingDefault.skip;
  const limit = query.limit || pagingDefault.limit;
  let messagesQuery = {};
  if (query.room) {
    messagesQuery = {
      room: query.room,
    };
  }

  try {
    const total = await Message.count(messagesQuery);
    const messages = await Message
      .find(messagesQuery)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
    res.status(200).json({
      total,
      limit,
      skip,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: errors.GeneralError.message,
      error,
    });
  }
});

/**
 * entry point: /messages
 * method: POST
 */

messagesController.post('/', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    res.status(400).json({
      code: 400,
      message: errors.BadRequest.message,
    });
  } else {
    try {
      const messageToSave = new Message(message);
      const result = await messageToSave.save();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: errors.GeneralError.message,
        error,
      });
    }
  }
});

export default messagesController;
