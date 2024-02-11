const express = require('express');
const CartManagerMongo = require('../src/dao/db/cartManagerMongo');
const mongoose = require('mongoose');

const cartRouter = express.Router();

cartRouter.get('/', async (req, res) => {
    try {
        const carts = await CartManagerMongo.getCarts();
        res.status(200).json(carts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener carritos desde MongoDB.' });
    }
});

cartRouter.post('/', async (req, res) => {
    try {
        const newCart = await CartManagerMongo.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno del servidor al crear un carrito en MongoDB.' });
    }
});

cartRouter.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await CartManagerMongo.getCartById(cartId);

        if (cart) {
            res.status(200).json(cart);
        } else {
            res.status(404).json({ error: `No se encontró ningún carrito con el ID ${cartId}` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el carrito desde MongoDB.' });
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

module.exports = cartRouter;

