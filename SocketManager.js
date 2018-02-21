import { Message } from './db/models';
import { underscoreId } from './global';
import redisClient from './redisClient';

let instance = null;
global.users = {};

class SocketManager {
  constructor() {
    if (!instance) {
      instance = this;

      // Set io to object
      const { io } = global;
      this.io = io;
      io.on('connection', (client) => {
        console.log('Socket connected...', client.id);
        // Set client to object
        this.client = client;
        client.on('messages-central', (data) => {
          if (data.TYPE === 'SEND_MESSAGE') {
            // create message
            const newMessage = new Message({
              room: data.SENT_TO,
              content: data.message,
              owner: data.user[underscoreId],
            });
            newMessage.save().then((result) => {
              const final = result.toObject();
              final.owner = data.user;
              const broadcastMessage = { SENT_TO: data.SENT_TO, message: final };
              io.sockets.in(data.SENT_TO).emit('receiveMessages', broadcastMessage);
            }).catch((err) => {
              console.log(err);
            });
            // board cast to rooms
          }

          if (data.TYPE === 'LIKE') {
            console.log('LIKED', data);
            Message.findOneAndUpdate(
              { _id: data.message[underscoreId] },
              { $addToSet: { likes: data.user } },
              { new: true }).populate('likes').then((result) => {
              console.log('======result', result);
              io.sockets.in(data.message.room).emit('likes', result);
            });
          }
        });
        client.on('rooms-central', (data) => {
          if (data.TYPE === 'JOIN_ROOM') {
            const roomId = data.ROOM_ID;
            client.join(data.ROOM_ID, () => {
              // Boardcast to others not myself
              client.broadcast.emit(roomId, 'a new user joined this room');
              console.log('Current rooms', client.rooms);
            });
          }
          if (data.TYPE === 'LEAVE_ROOM') {
            // FIXME: implement leave room
          }
        });

        client.on('online-central', (data) => {
          if (data.TYPE === 'SET_ONLINE') {
            // console.log('Set online working....', data);
            redisClient.set(`cmc_OnlineStatus_${data.user[underscoreId]}`, true);


            this.io.emit('onlineStatus', {
              user: {
                _id: data.user[underscoreId],
                online: true,
              },
            });

            let currentSockets = global.users[data.user[underscoreId]];
            if (!currentSockets) {
              currentSockets = [];
              currentSockets.push(client.id);
            } else {
              currentSockets.push(client.id);
            }
            global.users[data.user[underscoreId]] = currentSockets;
            console.log('=====global.users=====', global.users);
          }
        });

        client.on('disconnect', () => {
          console.log('One client disconnecting....', client.id);
          // io.sockets.clients('room') -> socket in room
          const values = Object.values(global.users);
          const keys = Object.keys(global.users);
          for (let i = 0; i < values.length; i += 1) {
            const value = values[i];
            if (values[i].includes(client.id)) {
              const newValue = value.filter(item => item !== client.id);
              const key = keys[i];
              if (newValue.length === 0) {
                redisClient.set(`cmc_OnlineStatus_${key}`, false);
                this.io.emit('onlineStatus', {
                  user: {
                    _id: key,
                    online: false,
                  },
                });
              }
              global.users[key] = newValue;
            }
          }
          console.log(global.users);
        });

      });
    }
    return instance;
  }
}


export default SocketManager;
