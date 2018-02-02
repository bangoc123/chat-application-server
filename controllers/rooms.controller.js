import express from 'express';
import passport from 'passport';
// import User from './../db/User';
import { Room, Message } from '../db/models';
import { errors, pagingDefault, underscoreId } from './../global';

const roomsController = express.Router();

/**
 * entry point: /rooms/:id
 * method: GET
 */
roomsController.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const roomId = req.params.id;
  const promises = [];
  const promise1 = Room.findById(roomId).lean().exec();
  const promise2 = Message.find({ room: roomId }).lean().exec();
  promises.push(promise1);
  promises.push(promise2);
  Promise.all(promises).then((result) => {
    const room = result[0];
    const messages = result[1];
    if (!room) {
      // FIXME
    }
    room.messages = messages;
    res.status(200).json(room);
  }).catch((err) => {
    const { message } = err;
    res.status(500).json({
      code: 500,
      message,
    });
  });
});

/**
 * entry point: /rooms
 * method: GET
 */

roomsController.get('/', async (req, res) => {
  const { query } = req;
  const skip = parseInt(query.skip) || pagingDefault.skip;
  const limit = parseInt(query.limit) || pagingDefault.limit;
  const { userId } = query;
  let queryMongoose = {};
  if (userId) {
    queryMongoose = {
      members: userId,
    };
  }
  try {
    const total = await Room.count(queryMongoose);
    const rooms = await Room
      .find(queryMongoose)
      .skip(skip)
      .limit(limit);
    res.status(200).json({
      skip,
      limit,
      total,
      data: rooms,
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
 * entry point: /rooms
 * method: POST
 */
roomsController.post('/', async (req, res) => {
  const { room } = req.body;
  if (!room) {
    res.status(400).json({
      code: 400,
      message: errors.BadRequest.message,
    });
  } else {
    try {
      const roomToSave = new Room(room);
      const result = await roomToSave.save();
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

export default roomsController;
