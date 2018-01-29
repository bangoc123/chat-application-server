import mongoose from 'mongoose';
import messageSchema from '../schemas/message.schema';

const Message = mongoose.model('Message', messageSchema);
export default Message;
