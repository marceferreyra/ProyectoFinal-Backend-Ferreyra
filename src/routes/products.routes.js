const express = require('express');
const productController = require('../dao/db/controllers/productController.js');
const upload = require('../config/rtpMulterConfig.js')


const productRouter = express.Router();

productRouter.get('/api/products', productController.getProducts);
productRouter.post('/api/products', upload.array('productThumbnails', 2), productController.addProduct);
productRouter.get('/api/products/:id', productController.getProductById);
productRouter.delete('/api/products/:id', productController.deleteProduct);
productRouter.put('/api/products/:id', productController.updateProduct);


module.exports = productRouter;
