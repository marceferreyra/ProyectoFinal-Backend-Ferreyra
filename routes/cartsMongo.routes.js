const express = require('express');
const CartManagerMongo = require('../src/dao/db/cartManagerMongo');
const mongoose = require('mongoose');
const Cart = require('../src/dao/db/models/cartModel')


const cartRouter = express.Router();

cartRouter.get('/', async (req, res) => {
    try {
        const carts = await CartManagerMongo.getCarts();
        const formattedResponse = JSON.stringify(carts, null, '\t');
        res.type('json').send(formattedResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener carritos desde MongoDB.' });
    }
});

cartRouter.post('/api/carts', async (req, res) => {
    try {
        const newCart = await CartManagerMongo.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno del servidor al crear un carrito en MongoDB.' });
    }
});

cartRouter.get('api/carts', async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await Cart.findOne({ _id: cartId }).populate('products.product');

        if (cart) {
            const formattedResponse = JSON.stringify(cart, null, '\t');
            res.type('json').send(formattedResponse);
        } else {
            const errorResponse = {
                status: 'error',
                error: `No se encontró ningún carrito con el ID ${cartId}`,
            };

            res.status(404).json(errorResponse);
        }
    } catch (error) {
        console.error(error);

        const errorResponse = {
            status: 'error',
            error: 'Error al obtener el carrito desde MongoDB.',
        };

        res.status(500).json(errorResponse);
    }
});

cartRouter.post('/:cid/products/:pid', async (req, res) => {
    const cartId = '65c54d2ac9a7e78958d529e9';
    const productId = req.params.pid;

    try {
        const result = await CartManagerMongo.addProductToCart(cartId, productId);
        if (result.error) {
            res.status(404).json({ error: result.error });
        } else {
            res.redirect(`/carts/${cartId}`);
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno del servidor al agregar un producto al carrito en MongoDB.' });
    }
});

cartRouter.post('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const result = await CartManagerMongo.addProductToCart(cartId, productId);
        if (result.error) {
            res.status(404).json({ error: result.error });
        } else {
            res.status(200).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno del servidor al agregar un producto al carrito en MongoDB.' });
    }
});

cartRouter.delete('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const result = await CartManagerMongo.deleteProductFromCart(cartId, productId);

        if (result.error) {
            res.status(404).json({ error: result.error });
        } else {
            res.status(200).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar un producto del carrito desde MongoDB.' });
    }
});

cartRouter.delete('/:cid', async (req, res) => {
    const cartId = req.params.cid;

    try {
        const result = await CartManagerMongo.deleteCart(cartId);

        if (result.error) {
            res.status(404).json({ error: result.error });
        } else {
            res.status(200).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar un carrito desde MongoDB.' });
    }
});

cartRouter.get('/:id', async (req, res) => {
    const cartId = req.params.id;

    try {
        const cart = await Cart.findById(cartId).populate('products.product');

        if (cart) {
            const plainCart = cart.toObject({ getters: true });
            res.render('carts', { carts: [plainCart] });
        } else {
            const errorResponse = {
                status: 'error',
                error: `No se encontró ningún carrito con el ID ${cartId}`,
            };
            res.status(404).json(errorResponse);
        }
    } catch (error) {
        console.error(error);
        const errorResponse = {
            status: 'error',
            error: 'Error al obtener el carrito desde MongoDB.',
        };
        res.status(500).json(errorResponse);
    }
});



module.exports = cartRouter;

