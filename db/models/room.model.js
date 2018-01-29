import mongoose from 'mongoose';
import roomSchema from '../schemas/room.schema';

const Room = mongoose.model('Room', roomSchema);
export default Room;
