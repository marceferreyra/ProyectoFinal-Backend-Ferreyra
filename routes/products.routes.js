const express = require('express');
const productController = require('../src/dao/db/controllers/productController.js');

const productRouter = express.Router();

productRouter.get(`/`, (req, res) => {
    res.redirect('/api/sessions/login') 
});

productRouter.get('/api/products', productController.getProducts);
productRouter.get('/api/products/:id', productController.getProductById);
productRouter.post('/api/products', productController.addProduct);
productRouter.delete('/api/products/:id', productController.deleteProduct);
productRouter.put('/api/products/:id', productController.updateProduct);

productRouter.get('/products', productController.getProducts);
productRouter.get('/products/:id', productController.getProductById);

module.exports = productRouter;
