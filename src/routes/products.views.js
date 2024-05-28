const Cart = require('../dao/db/models/cartModel');
const productService = require('../dao/db/services/productService');

exports.renderProductsView = async (req, res) => {
    try {
        const productsResult = await productService.getProducts(req);
        const products = productsResult.docs;
        const plainProducts = products.map(product => product.toObject({ getters: true }));
        const user = req.session.user;
        const cartId = user ? user.cartId : null;

        res.render('products', { products: plainProducts, user, cartId });
    } catch (error) {
        req.logger.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

exports.renderProductDetailView = async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await productService.getProductById(productId, req);
        if (product) {
            const plainProduct = product.toObject({ getters: true });
            const user = req.session.user;
            res.render('productDetail', { product: plainProduct, user });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        req.logger.error(error);
        res.status(500).send('Error interno del servidor');
    }
};