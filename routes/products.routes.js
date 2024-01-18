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
    try {
        const { title, description, price, thumbnail, code, stock, status, category } = req.body;

        await productManager.addProduct(title, description, price, thumbnail, code, stock, status, category);
        res.json({ message: 'Producto agregado correctamente.' });
    } catch (error) {
       if (error.message === "Todos los campos son obligatorios") {
    res.status(400).json({ error: error.message });
        } else if (error.message.includes(`Ya existe un producto con el código ${code}`)) {
            res.status(400).json({ error: error.message });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Error al agregar el producto' });
        }
    }
});



productRouter.delete('/api/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);

        await productManager.deleteProduct(productId);

        res.json({ message: `Producto con ID ${productId} eliminado correctamente.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

productRouter.put('/api/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const updatedProduct = req.body;

        await productManager.updateProduct(productId, updatedProduct);

        res.json({ message: `Producto con ID ${productId} actualizado correctamente.` });
    } catch (error) {
        if (error.message === 'No se puede modificar el ID del producto') {
            res.status(400).json({ error: 'No se puede modificar el ID del producto' });
        } else if (error.message.startsWith('No se encontró ningún producto con el ID')) {
            res.status(404).json({ error: error.message });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Error al actualizar el producto' });
        }
    }
});

module.exports = productRouter;


