const express = require('express');
const ProductManager = require('../src/productManager');
const homeRouter = express.Router();

const productManager = new ProductManager();

homeRouter.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('layouts/home', { products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

module.exports = homeRouter;
