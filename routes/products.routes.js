const express = require('express');
const ProductManager = require('../src/productManager');
const productRouter = express.Router();

productRouter.use(express.json());

const productManager = new ProductManager();

productRouter.get(`/`, (req, res) => {
    res.send(`Bienvenidos a nuestro e-commerce`)
})

productRouter.get('/api/products', async (req, res) => {
    try {
        const limit = req.query.limit || undefined;
        const products = await productManager.getProducts();

        if (limit) {
            const limitedProducts = products.slice(0, limit);
            res.type('json').json(limitedProducts);
        } else {
            res.type('json').json(products);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});


productRouter.get('/api/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);

        if (product) {
            res.type('json').json(product);
        } else {
            res.status(404).json({ error: `No se encontró ningún producto con el ID ${productId}` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});


productRouter.post('/api/products', async (req, res) => {
    const { title, description, price, thumbnail, code, stock, status, category } = req.body;

    try {
        const result = await productManager.addProduct(title, description, price, thumbnail, code, stock, status, category);

        if (result.error) {
            res.status(400).json({ error: result.error });
        } else {
            res.status(200).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});



productRouter.delete('/api/products/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);

    try {
        const result = await productManager.deleteProduct(productId);

        if (result.error) {
            res.status(404).json({ error: result.error });
        } else {
            res.status(200).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});


productRouter.put('/api/products/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    const updatedProduct = req.body;

    try {
        const result = await productManager.updateProduct(productId, updatedProduct);

        if (result.error) {
            res.status(404).json({ error: result.error });
        } else {
            res.status(200).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

module.exports = productRouter;


