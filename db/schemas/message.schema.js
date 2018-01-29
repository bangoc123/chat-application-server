import { Schema } from 'mongoose';

const messageSchema = new Schema({
  room: { type: String, ref: 'Room', required: true },
  owner: { type: String, ref: 'User', required: true },
  content: { type: String, required: true },
});

export default messageSchema;
