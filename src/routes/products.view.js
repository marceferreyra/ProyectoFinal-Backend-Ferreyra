

productRouter.get('/api/products', productController.getProducts);
res.render('products', { products: plainProducts, user, cartId }); 