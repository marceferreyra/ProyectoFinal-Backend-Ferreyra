const User = require('../models/userModel');
const cartService = require('../services/cartService');
const bcrypt = require('bcrypt');

exports.isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.redirect('/api/sessions/login');
    }
};

exports.githubAuthCallback = async (req, res) => {
    try {
        req.session.user = req.user;

        let user = await User.findOne({ email: req.user.email });

        if (!user) {
            const { username, email } = req.user;

            const newCart = await cartService.createCart();

            user = new User({
                first_name: username,
                email: email,
                cartId: newCart._id
            });
        } else if (!user.cartId) {
            const newCart = await cartService.createCart();

            user.cartId = newCart._id;
        }

        await user.save();

        res.redirect('/api/sessions/current');
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.renderRegister = (req, res) => {
    res.render('register');
};

exports.renderLogin = (req, res) => {
    res.render('login');
};

exports.register = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya existe. Inicia sesión.' });
        }

        const role = email === 'adminCoder@coder.com' ? 'admin' : 'user';

        const newCart = await cartService.createCart();

        const newUser = new User({
            first_name,
            last_name,
            email,
            age,
            password,
            role,
            cartId: newCart._id
        });

        await newUser.save();
        res.redirect('/api/sessions/login');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.login = async (req, res) => {
    try {
        if (req.session.user) {
            return res.status(400).json({ error: 'Ya has iniciado sesión' });
        }

        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'El usuario no existe. Registrate para iniciar sesión' });
        }

        if (!await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        req.session.user = user;
        res.redirect('/api/sessions/current');
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            res.status(500).json({ error: 'Error interno del servidor' });
        } else {
            res.redirect('/api/sessions/login');
        }
    });
};

exports.getCurrent = async (req, res) => {
    try {
        const userId = req.session.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const userObject = user.toObject();
        const isAdmin = userObject.role === 'admin';

        if (isAdmin) {
            const users = await User.find({}, { email: 1, _id: 0 });
            res.render('current', { user: userObject, isAdmin, users });
        } else {

            res.render('current', { user: userObject, isAdmin });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const userId = req.session.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const userObject = user.toObject();
        res.render('profile', { user: userObject });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.handle404 = (req, res) => {
    res.status(404).render('404');
};