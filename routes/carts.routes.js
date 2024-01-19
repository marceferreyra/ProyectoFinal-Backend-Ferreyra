const express = require('express');
const CartManager = require('../src/cartManager');

const cartRouter = express.Router();
const cartManager = new CartManager();

cartRouter.use(express.json());

cartRouter.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.json(newCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

cartRouter.get('/:cid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const cart = await cartManager.getCartById(cartId);

        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ error: `No se encontró ningún carrito con el ID ${cartId}` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

cartRouter.post('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const quantity = req.body.quantity || 1;

        const cart = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});

cartRouter.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);

        const cart = await cartManager.deleteProductFromCart(cartId, productId);

        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar producto del carrito' });
    }
})

cartRouter.delete('/:cid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);       
        const result = await cartManager.deleteCart(cartId);

        if (result) {
            res.json({ message: `Carrito con ID ${cartId} eliminado correctamente.` });
        } else {
            res.status(404).json({ error: `No se encontró ningún carrito con el ID ${cartId}` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el carrito' });
    }
});

module.exports = cartRouter;
