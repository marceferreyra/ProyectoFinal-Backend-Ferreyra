const express = require('express');
const ProductManager = require('../src/productManager');
const realTimeProductsRouter = express.Router();
const productManager = new ProductManager();

realTimeProductsRouter.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('layouts/realTimeProducts', { products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

module.exports = realTimeProductsRouter
