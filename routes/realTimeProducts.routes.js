const express = require('express');
const productManagerMongo = require('../src/dao/db/managers/productManagerMongo');
const realTimeProductsRouter = express.Router();

realTimeProductsRouter.get('/', async (req, res) => {
    try {
        const products = await productManagerMongo.getProducts();
        const plainProducts = products.map(product => product.toObject({ getters: true }));
        res.render('realtimeproducts', { products: plainProducts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener productos desde MongoDB.' });
    }
});

module.exports = realTimeProductsRouter