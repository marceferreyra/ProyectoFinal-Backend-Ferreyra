const express = require('express');
const productController = require('../dao/db/controllers/productController.js');
const renderProductViews = require('./products.views.js');
const authorize = require('../config/middlewares');

const productRouter = express.Router();

productRouter.get(`/`, (req, res) => {
    res.redirect('/api/sessions/login')
});

productRouter.get('/api/products',  renderProductViews.renderProductsView, productController.getProducts);
productRouter.post('/api/products', productController.addProduct);
productRouter.get('/api/products/:id', renderProductViews.renderProductDetailView, productController.getProductById);
productRouter.delete('/api/products/:id', productController.deleteProduct);
productRouter.put('/api/products/:id', productController.updateProduct);


module.exports = productRouter;
