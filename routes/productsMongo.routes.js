const express = require('express');
const productManagerMongo = require('../src/dao/db/productManagerMongo');
const mongoose = require('mongoose')
const Product = require('../src/dao/db/models/productModel');

const productRouter = express.Router();

productRouter.get(`/`, (req, res) => {
    res.redirect('/api/sessions/login') 
});

productRouter.get('/api/products', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sortOrder = req.query.sortOrder || 'asc';
        const orderByField = req.query.orderByField || 'price';

        const filter = {};
        if (req.query.category) {
            filter.category = req.query.category;
        }
        if (req.query.availability !== undefined) {
            filter.status = req.query.availability === 'true';
        }

        const options = {
            limit: limit,
            page: page,
            sort: { price: sortOrder === 'asc' ? 1 : -1 },
        };

        const result = await Product.paginate(filter, options);

        const response = {
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}&sortOrder=${sortOrder}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}&sortOrder=${sortOrder}` : null,
        };

        const formattedResponse = JSON.stringify(response, null, '\t');

        res.type('json').send(formattedResponse);
    } catch (error) {
        console.error(error);
    
        const errorResponse = {
            status: 'error',
            error: 'Error al obtener productos',
        };
    
        res.status(500).json(errorResponse);
    }
});

productRouter.get('/api/products/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await productManagerMongo.getProductById(productId);

        if (product) {
            const response = {
                status: 'success',
                payload: product,
            };

            const formattedResponse = JSON.stringify(response, null, '\t');

            res.type('json').send(formattedResponse);
        } else {
            const errorResponse = {
                status: 'error',
                error: `No se encontró ningún producto con el ID ${productId}`,
            };

            res.status(404).json(errorResponse);
        }
    } catch (error) {
        console.error(error);

        const errorResponse = {
            status: 'error',
            error: 'Error al obtener el producto desde MongoDB.',
        };

        res.status(500).json(errorResponse);
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

productRouter.get('/products', async (req, res) => {
    try {
        const products = await productManagerMongo.getProducts();
        const plainProducts = products.map(product => product.toObject({ getters: true }));
        const user = req.session.user;
        
        res.render('products', { products: plainProducts, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener productos desde MongoDB.' });
    }
});


productRouter.get('/products/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await productManagerMongo.getProductById(productId);
        const plainProduct = product.toObject({ getters: true }); 
        if (product) {           
            res.render('productDetail', { product: plainProduct }); 
        } else {
            const errorResponse = {
                status: 'error',
                error: `No se encontró ningún producto con el ID ${productId}`,
            };
            res.status(404).json(errorResponse);
        }
    } catch (error) {
        console.error(error);
        const errorResponse = {
            status: 'error',
            error: 'Error al obtener el producto desde MongoDB.',
        };
        res.status(500).json(errorResponse);
    }
});

module.exports = productRouter;
