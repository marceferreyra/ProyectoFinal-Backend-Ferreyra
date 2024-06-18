const express = require('express');
const viewsRouter = express.Router();
const authorize = require('../config/middlewares')
const User = require('../dao/db/models/userModel')

viewsRouter.get('/users', authorize, async (req, res) => {
    try {
        const users = await User.find().lean(); 

        res.render('users', { users });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

viewsRouter.post('/users/:id/role', authorize, async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        await User.findByIdAndUpdate(id, { role });

        res.redirect('/users');
    } catch (error) {
        console.error('Error al actualizar el rol del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

viewsRouter.delete('/users/:id', authorize, async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.redirect('/users');
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = viewsRouter;