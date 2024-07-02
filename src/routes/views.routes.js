const express = require('express');
const viewsRouter = express.Router();
const authorize = require('../config/middlewares')
const User = require('../dao/db/models/userModel')
const Product = require('../dao/db/models/productModel')
const productService = require('../dao/db/services/productService');
const Cart = require('../dao/db/models/cartModel');
const path = require('path');
const mongoose = require('mongoose')

//home

viewsRouter.get(`/`, (req, res) => {
    res.redirect('/products')
});

//vistas payment

viewsRouter.get('/payment/:cid', async (req, res) => {

    const user = req.session.user;

    try {
        const cartId = req.params.cid;
        const cart = await Cart.findById(cartId).populate('products.product');
        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }

        const totalPrice = cart.products.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);

        const plainCart = cart.toObject({ getters: true });

        res.render('payment', { cart: plainCart, totalPrice, stripePublicKey: process.env.STRIPE_PUBLIC_KEY, user });
    } catch (error) {
        console.error('Error al procesar solicitud de pago:', error);
        res.status(500).send('Error interno del servidor');
    }
});

//vistas users

viewsRouter.get('/users', authorize, async (req, res) => {
    try {
        const userId = req.session.user._id;
        const user = await User.findById(userId).lean();
        const users = await User.find().lean();


        res.render('users', { user, users, userId });
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

viewsRouter.get('/users/premium/:uid', async (req, res) => {
    try {
        const userId = req.params.uid;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send('El ID de usuario no es válido');
        }

        const user = await User.findById(userId).lean();

        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        res.render('premium-user', { user });

    } catch (error) {
        console.error('Error al renderizar la página premium:', error);
        res.status(500).send('Error interno del servidor');
    }
});

viewsRouter.get('/users/:uid/documents', async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await User.findById(userId).lean({ getters: true });

        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        res.render('premium-user-documents', { user });
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }
});

//vistas products

viewsRouter.get('/products', async (req, res) => {
    try {
        const productsResult = await productService.getProducts(req);
        const products = productsResult.docs;
        const plainProducts = products.map(product => product.toObject({ getters: true }));
        const user = req.session.user || null;
        const cartId = user ? user.cartId : null;
        const { totalPages, page, hasPrevPage, hasNextPage, prevPage, nextPage } = productsResult;
        const limit = req.query.limit || 9;
        const category = req.query.category || '';
        const status = req.query.status || '';
        const owner = req.query.owner || '';
        const sort = req.query.sort || '';

        const createLink = (pageNum) => `/products?page=${pageNum}&limit=${limit}&category=${category}&status=${status}&owner=${owner}&sort=${sort}`;

        res.render('products', { 
            products: plainProducts, 
            user, 
            cartId, 
            isAdmin: user ? user.role === 'admin' : false, 
            totalPages, 
            page, 
            hasPrevPage, 
            hasNextPage, 
            prevLink: hasPrevPage ? createLink(prevPage) : null, 
            nextLink: hasNextPage ? createLink(nextPage) : null 
        });
    } catch (error) {
        req.logger.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

viewsRouter.get('/products/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await productService.getProductById(productId, req);
        if (product) {
            const plainProduct = product.toObject({ getters: true });
            const user = req.session.user;
            res.render('productDetail', { product: plainProduct, user, isAdmin: user.role === 'admin' });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        req.logger.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

//vistas realTimeProducts

viewsRouter.get('/realtimeproducts', authorize, async (req, res) => {
    try {
        const { limit = 10, page = 1, category, status, owner, sort } = req.query;
        const filters = {};

        if (category) filters.category = category;
        if (status) filters.status = status === 'true';
        if (owner) filters.owner = owner;

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
        };

        if (sort) {
            options.sort = { price: sort === 'asc' ? 1 : -1 };
        }

        const products = await Product.paginate(filters, options);

        const plainProducts = products.docs.map(product => product.toObject({ getters: true }));
        const user = req.session.user;
        const cartId = user ? user.cartId : null;

        res.render('realtimeproducts', { products: plainProducts, user, cartId, isAdmin: user.role === 'admin' });
    } catch (error) {
        console.error('Error al obtener productos en tiempo real:', error);
        res.status(500).send('Error interno del servidor');
    }
});

//vistas carts

viewsRouter.get('/carts/:cid', authorize, async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await Cart.findById(cartId).populate('products.product');
        const user = req.session.user;

        if (cart) {
            const plainCart = cart.toObject({ getters: true });
            res.render('carts', { carts: [plainCart], cartId: cartId, user });
        } else {
            res.status(404).send('Carrito no encontrado');
        }
    } catch (error) {
        req.logger.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

//vistas sessions

viewsRouter.get('/register', async (req, res) => {
    res.render('register')
})

viewsRouter.get('/login', (req, res) => {
    res.render('login');
});

viewsRouter.get('/forgot-password', (req, res) => {
    res.render('forgot-password');
});

viewsRouter.get('/forgot-password-confirm', (req, res) => {
    res.render('forgot-password-confirm');
});

viewsRouter.get('/reset-password', (req, res) => {
    res.render('reset-password');
});

viewsRouter.get('/profile', async (req, res) => {
    try {
        const userId = req.session.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const userObject = user.toObject();
        const isAdmin = userObject.role === 'admin';

        if (userObject.documents && userObject.documents.length > 0) {
            userObject.documents = userObject.documents.map(doc => ({
                ...doc,
                fileName: path.basename(doc.reference)
            }));
        }

        if (isAdmin) {
            const users = await User.find({}, { email: 1, _id: 0 });
            res.render('profile', { user: userObject, isAdmin, users });
        } else {
            res.render('profile', { user: userObject, isAdmin });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//vistas chats

viewsRouter.get('/current', async (req, res) => {
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
});

viewsRouter.get('*', (req, res) => {
    res.status(404).render('404');
});

module.exports = viewsRouter;