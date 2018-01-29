import { Schema } from 'mongoose';

const roomSchema = new Schema({
  name: { type: String, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

export default roomSchema;
