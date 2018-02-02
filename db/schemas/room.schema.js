import { Schema } from 'mongoose';

const roomSchema = new Schema({
  name: { type: String, required: true },
  members: [{ type: String, ref: 'User' }],
});

export default roomSchema;
