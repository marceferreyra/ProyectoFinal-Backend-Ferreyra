const express = require('express');
const productManagerMongo = require('../src/dao/db/productManagerMongo');
const homeRouter = express.Router();


homeRouter.get('/', async (req, res) => {
    try {
        const products = await productManagerMongo.getProducts();
        const plainProducts = products.map(product => product.toObject({ getters: true }));
        res.render('layouts/home', { products: plainProducts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener productos desde MongoDB.' });
    }
});

module.exports = homeRouter;
