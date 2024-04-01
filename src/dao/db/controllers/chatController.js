const Message = require('../models/chatModel');

exports.getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find().lean(); // Utiliza el método lean() para obtener objetos planos
        res.render('chat', { messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor al obtener los mensajes.' });
    }
}

exports.createMessage = async (req, res) => {
    const { user, message } = req.body;
    try {
        const newMessage = new Message({ user, message });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno del servidor al crear un mensaje.' });
    }
};

// Puedes agregar otras funciones según las necesidades de tu aplicación
