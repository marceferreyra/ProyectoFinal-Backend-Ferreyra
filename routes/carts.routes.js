const express = require('express');
const CartService = require('../src/dao/db/services/cartService');
const mongoose = require('mongoose');
const Cart = require('../src/dao/db/models/cartModel')


const cartRouter = express.Router();

cartRouter.get('/api/carts', async (req, res) => {
    try {
        const carts = await Cart.find().populate('products.product');

        if (carts.length > 0) {
            const formattedResponse = JSON.stringify(carts, null, '\t');
            res.type('json').send(formattedResponse);
        } else {
            const errorResponse = {
                status: 'error',
                error: 'No se encontraron carritos.',
            };
            res.status(404).json(errorResponse);
        }
    } catch (error) {
        console.error(error);

        const errorResponse = {
            status: 'error',
            error: 'Error al obtener los carritos desde MongoDB.',
        };

        res.status(500).json(errorResponse);
    }
});

cartRouter.post('/api/carts', async (req, res) => {
    try {
        const newCart = await CartService.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno del servidor al crear un carrito en MongoDB.' });
    }
});

cartRouter.get('/api/carts/:cid', async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await Cart.findById(cartId);
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

cartRouter.put('/api/carts/:cid', async (req, res) => {
    const cartId = req.params.cid;

    try {
        const updatedCart = await Cart.findByIdAndUpdate(cartId, req.body, { new: true });
        res.status(200).json(updatedCart);
        res.status(501).json({ error: 'Este método aún no ha sido implementado.' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno del servidor al actualizar un carrito en MongoDB.' });
    }
});

cartRouter.delete('/api/carts/:cid', async (req, res) => {
    const cartId = req.params.cid;

    try {
        const result = await CartService.deleteCart(cartId);

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


cartRouter.post('/api/carts/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const result = await CartService.addProductToCart(cartId, productId);
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

cartRouter.put('/api/carts/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    try {
        const result = await CartService.updateProductQuantityInCart(cartId, productId, quantity);
        if (result.error) {
            res.status(404).json({ error: result.error });
        } else {
            res.status(200).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno del servidor al actualizar la cantidad de un producto en el carrito en MongoDB.' });
    }
});

cartRouter.delete('api/carts/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const result = await CartService.deleteProductFromCart(cartId, productId);

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


cartRouter.get('/carts/:cid', async (req, res) => {
    const cartId = req.params.cid;

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

