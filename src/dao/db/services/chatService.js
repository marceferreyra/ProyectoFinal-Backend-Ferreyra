const Message = require('../models/chatModel');

class ChatService {
    constructor(io) {
        this.io = io;
    }

    init() {
        this.io.on('connection', (socket) => {
          

            socket.on('message', async (data) => {
                const { user, message } = data;
                const newMessage = new Message({ user, message });
                await newMessage.save();

                this.io.emit('message', newMessage);
            });

            socket.on('disconnect', () => {
                console.log('Cliente desconectado');
            });
        });
    }
}

module.exports = ChatService;
