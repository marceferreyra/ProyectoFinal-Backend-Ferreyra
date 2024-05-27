const express = require('express');
const productController = require('../dao/db/controllers/productController.js');
const authorize = require('../config/middlewares');

const productRouter = express.Router();

productRouter.get(`/`, (req, res) => {
    res.redirect('/api/sessions/login')
});

productRouter.get('/api/products', productController.getProducts);
productRouter.get('/api/products/:id', productController.getProductById);
productRouter.post('/api/products', productController.addProduct);
productRouter.delete('/api/products/:id', productController.deleteProduct);
productRouter.put('/api/products/:id', productController.updateProduct);


module.exports = productRouter;
