/*const chatService = require('../services/chatService');

exports.getAllMessages = async (req, res) => {
    try {
        const messages = await chatService.getAllMessages();
        res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener mensajes desde la base de datos.' });
    }
};

exports.addMessage = async (req, res) => {
    try {
        const { user, message } = req.body;
        const newMessage = await chatService.addMessage(user, message);
        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno del servidor al agregar un mensaje.' });
    }
};
*/