const express = require('express');
const productManagerMongo = require('../dao/productManagerMongo');

const productRouter = express.Router();

productRouter.get('/api/products', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10);
        
        if (limit) {
            const products = await productManagerMongo.getProducts(limit);
            res.status(200).json(products);
        } else {
            const products = await productManagerMongo.getProducts();
            res.status(200).json(products);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener productos desde MongoDB.' });
    }
});

productRouter.get('/api/products/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await productManagerMongo.getProductById(productId);

        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ error: `No se encontró ningún producto con el ID ${productId}` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el producto desde MongoDB.' });
    }
});

productRouter.post('/api/products', async (req, res) => {
    const { title, description, price, thumbnail, code, stock, status, category } = req.body;
    try {
        const result = await productManagerMongo.addProduct(title, description, price, thumbnail, code, stock, status, category);

        if (result.error) {
            res.status(400).json({ error: result.error });
        } else {
            res.status(201).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno del servidor al agregar un producto en MongoDB.' });
    }
});

productRouter.delete('/api/products/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        const result = await productManagerMongo.deleteProduct(productId);

        if (result.error) {
            res.status(404).json({ error: result.error });
        } else {
            res.status(200).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar un producto desde MongoDB.' });
    }
});

productRouter.put('/api/products/:id', async (req, res) => {
    const productId = req.params.id;
    const updatedProduct = req.body;

    try {
        const result = await productManagerMongo.updateProduct(productId, updatedProduct);

        if (result.error) {
            res.status(404).json({ error: result.error });
        } else {
            res.status(200).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno del servidor al actualizar un producto en MongoDB.' });
    }
});

module.exports = productRouter;
