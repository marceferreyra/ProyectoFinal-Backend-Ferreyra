const express = require('express');
const sessionRouter = express.Router();
const User = require('../src/dao/db/models/userModel');
const bcrypt = require('bcrypt');

function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.redirect('/api/sessions/login');
    }
}

sessionRouter.get('/register', (req, res) => {
    res.render('register');
});

sessionRouter.get('/login', (req, res) => {
    res.render('login');
});

sessionRouter.get('/profile', isAuthenticated, async (req, res) => {
    try {
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
        const { first_name, last_name, email, age, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        const role = email === 'adminCoder@coder.com' ? 'admin' : 'usuario';

        const newUser = new User({
            first_name,
            last_name,
            email,
            age,
            password,
            role,
        });
        await newUser.save();

        req.session.user = newUser;

        res.redirect('/api/sessions/login');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

sessionRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        req.session.user = user;
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
            res.redirect('/api/sessions/login');
        }
    });
});

module.exports = sessionRouter;
