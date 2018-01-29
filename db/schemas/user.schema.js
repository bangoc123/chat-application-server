import { Schema } from 'mongoose';

const userSchema = new Schema({
  username: { type: String, required: true },
  hashedPassword: { type: String, required: true },
  email: { type: String, required: true },
});

export default userSchema;
