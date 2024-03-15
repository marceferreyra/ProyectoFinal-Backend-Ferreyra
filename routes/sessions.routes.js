const express = require('express');
const sessionRouter = express.Router();
const User = require('../src/dao/db/models/userModel');
const cartManagerMongo = require('../src/dao/db/managers/cartManagerMongo')
const bcrypt = require('bcrypt');
const passport = require('passport')

function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.redirect('/api/sessions/login');
    }
}

sessionRouter.get('/github', passport.authenticate("githubAuth", {}), (req, res) => {

})

sessionRouter.get('/callbackGithub', passport.authenticate("githubAuth", {}), async (req, res) => {
    try {
        req.session.user = req.user;

        const existingUser = await User.findOne({ email: req.user.email });

        if (existingUser) {
            await existingUser.save();
        } else {
            const { username, email } = req.user;

            const newUser = new User({
                first_name: username,
                email: email,
            });

            await newUser.save();
        }

        res.redirect('/products');
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});



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

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const userObject = user.toObject();
        res.render('profile', { user: userObject });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

sessionRouter.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya existe. Inicia sesión.' });
        }

        const role = email === 'adminCoder@coder.com' ? 'admin' : 'user';

        const newCart = await cartManagerMongo.createCart();

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
        console.log(newUser);
        res.redirect('/api/sessions/login');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


sessionRouter.post('/login', async (req, res) => {
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
        console.log('CartId del usuario al iniciar sesión:', req.session.user.cartId);
        res.redirect('/products');
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

sessionRouter.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            res.status(500).json({ error: 'Error interno del servidor' });
        } else {
            res.redirect('/api/sessions/login');
        }
    });
});

sessionRouter.get('*', async (req, res) => {
    res.status(404).render('404')
})

module.exports = sessionRouter;
