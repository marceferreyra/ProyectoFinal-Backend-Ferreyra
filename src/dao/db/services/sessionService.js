const User = require('../models/userModel');
const cartService = require('../services/cartService');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

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

class SessionService {
    async isAuthenticated(req) {
        return req.session && req.session.user;
    }

    async githubAuthCallback(req, res) {
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
            res.redirect('/products');
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    async register(req, res) {
        try {
            const { first_name, last_name, email, age, password } = req.body;
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({ error: 'El usuario ya existe. Inicia sesión.' });
            }

            const role = email === 'adminCoder@coder.com' ? 'admin' : 'user';
            const newCart = await cartService.createCart(req);

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
            res.status(201).json({ message: 'Registro exitoso', newUser });
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    async login(email, password) {
        try {
            const user = await User.findOne({ email });

            if (!user) {
                return { error: 'El usuario no existe. Regístrate para iniciar sesión' };
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return { error: 'Credenciales inválidas' };
            }

            return { user };
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            throw new Error('Error interno del servidor');
        }
    }

    async logout(req, res) {
        try {
            if (req.session.user) {
                const userId = req.session.user._id;
                const user = await User.findById(userId);

                if (user) {
                    user.last_connection = new Date();
                    await user.save();
                }

                req.logout((err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Error interno del servidor' });
                    }
                    res.status(200).json({ message: 'Sesión cerrada exitosamente' });
                });
            } else {
                res.status(200).json({ message: 'Sesión cerrada exitosamente' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    async getCurrent(req, res) {
        try {
            const userId = req.session.user._id;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            res.status(200).json({ email: user.email, role: user.role });
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    async getProfile(req, res) {
        try {
            const userId = req.session.user._id;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            const userObject = user.toObject();

            if (userObject.documents && userObject.documents.length > 0) {
                userObject.documents = userObject.documents.map(doc => ({
                    ...doc,
                    fileName: path.basename(doc.reference)
                }));
            }

            res.status(200).json({ email: user.email, role: user.role, name: user.name || user.first_name, lastName: user.last_name, age: user.age });
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    async handle404(req, res) {
        res.status(404).json({ message: 'Recurso no encontrado' });
    }

    async sendPasswordResetEmail(req, res) {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.redirect('/forgot-password');
            }

            const resetToken = {
                email: email,
                expiration: new Date().getTime() + (1000 * 60 * 60)
            };

            req.session.resetToken = resetToken;

            const resetLink = `${req.protocol}://${req.get('host')}/reset-password?token=${resetToken}&expiration=${resetToken.expiration}`;

            const mailOptions = {
                to: email,
                subject: 'Restablecer contraseña',
                html: `Para restablecer tu contraseña, haz clic en el siguiente enlace: <a href="${resetLink}">Restablecer contraseña</a>`
            };

            await transporter.sendMail(mailOptions);

            res.status(200).json({ message: 'Correo de restablecimiento enviado' });
        } catch (error) {
            console.error('Error al enviar el correo electrónico de restablecimiento de contraseña:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    async resetPassword(req, res) {
        try {
            const resetToken = req.session.resetToken;
            if (!resetToken || !resetToken.email || !resetToken.expiration) {
                return res.status(400).json({ error: 'El enlace de restablecimiento de contraseña ha expirado. Solicita uno nuevo.' });
            }

            const now = new Date().getTime();
            if (now > resetToken.expiration) {
                return res.status(400).json({ error: 'El enlace de restablecimiento de contraseña ha expirado. Solicita uno nuevo.' });
            }

            const { email, password, confirmPassword } = req.body;
            if (password !== confirmPassword) {
                return res.status(400).json({ error: 'Las contraseñas no coinciden' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const updatedUser = await User.findOneAndUpdate(
                { email },
                { password: hashedPassword },
                { new: true }
            );

            if (!updatedUser) {
                return res.status(400).json({ error: 'Correo electrónico no encontrado' });
            }

            res.status(200).json({ message: 'Contraseña restablecida exitosamente' });
        } catch (error) {
            console.error('Error al restablecer la contraseña:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}

module.exports = SessionService;
