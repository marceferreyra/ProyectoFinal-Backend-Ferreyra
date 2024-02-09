const express = require('express');
const productManagerMongo = require('../dao/productManagerMongo');
const productRouter = express.Router();
const mongoose = require('mongoose')

productRouter.get('/', async (req, res) => {
    try {
        const products = await productManagerMongo.getProducts();
        res.render('layouts/home', { products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener productos desde MongoDB.' });
    }
});

module.exports = productRouter;
