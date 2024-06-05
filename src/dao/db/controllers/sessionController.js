const User = require('../models/userModel');
const cartService = require('../services/cartService');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

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
            const newCart = await cartService.createCart(req);

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

        const newCart = await cartService.createCart(req);

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
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

        const { email, password, newPassword } = req.body;
        
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'El usuario no existe. Regístrate para iniciar sesión' });
        }
        if (newPassword) {
            user.password = newPassword;
            await user.save();
        }
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        console.log('Inicio de sesión exitoso');
        req.session.user = user;
        res.redirect('/api/sessions/current');
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
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

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: "marceeferreyra@gmail.com",
        pass: "qxdjqqquughitrbp",
    },
    tls: {
        rejectUnauthorized: false
    }
});

exports.sendPasswordResetEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.redirect('/api/sessions/forgot-password');
        }

        const resetToken = {
            email: email,
            expiration: new Date().getTime() + (1000 * 60 * 60) 
        };

        req.session.resetToken = resetToken;

        const resetLink = `${req.protocol}://${req.get('host')}/api/sessions/reset-password?token=${resetToken}&expiration=${resetToken.expiration}`;

        const mailOptions = {
            to: email,
            subject: 'Restablecer contraseña',
            html: `Para restablecer tu contraseña, haz clic en el siguiente enlace: <a href="${resetLink}">Restablecer contraseña</a>`
        };

        await transporter.sendMail(mailOptions);

        res.render('forgot-password-confirm');
    } catch (error) {
        console.error('Error al enviar el correo electrónico de restablecimiento de contraseña:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.renderForgotPasswordForm = (req, res) => {
    res.render('forgot-password');
};

exports.renderResetPasswordForm = async (req, res) => {
    try {
        res.render('reset-password');
    } catch (error) {
        console.error('Error al renderizar el formulario de restablecimiento de contraseña:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const resetToken = req.session.resetToken;
        if (!resetToken || !resetToken.email || !resetToken.expiration) {
            return res.status(400).json({ error: 'El enlace de restablecimiento de contraseña ha expirado. Solicita uno nuevo.' });
        }

        const now = new Date().getTime();
        if (now > resetToken.expiration) {
            return res.redirect('/api/sessions/forgot-password');
        }

        const { email, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Las contraseñas no coinciden' });
        }
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: 'Correo electrónico no encontrado' });
        }
        const isSamePassword = await bcrypt.compare(password, user.password);

        if (isSamePassword) {
            return res.status(400).json({ error: 'No puedes usar la misma contraseña' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = password;
        await user.save();
        const updatedUser = await User.findOne({ email });

        res.redirect('/api/sessions/login');
    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


