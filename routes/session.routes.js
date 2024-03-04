const express = require('express');
const sessionRouter = express.Router();
const User = require('../src/dao/db/models/userModel');




sessionRouter.get('/register', (req, res) => {
    res.render('register');
});

sessionRouter.get('/login', (req, res) => {
    res.render('login');
});

sessionRouter.get('/profile', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/session/login');
        }

        const userId = req.session.user._id;
        const user = await User.findById(userId);

        const userObject = user.toObject();
        res.render('profile', { user: userObject });
    } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


sessionRouter.post('/register', async (req, res) => {
    try {
        console.log(req.body);
        const { first_name, last_name, email, age, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        const newUser = new User({ first_name, last_name, email, age, password });
        await newUser.save();

        req.session.user = newUser;

        res.redirect('/session/login')
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

sessionRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });

        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        req.session.user = user;

        // Redirigir a la ruta de productos después del inicio de sesión exitoso
        res.redirect('/products');
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

sessionRouter.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar la sesión:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
        } else {
            res.redirect('/session/login');
        }
    });
});



module.exports = sessionRouter;
