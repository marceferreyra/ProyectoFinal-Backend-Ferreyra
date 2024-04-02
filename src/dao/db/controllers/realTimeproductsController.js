const productService = require('../services/productService');

exports.getRealTimeProducts = async (req, res) => {
    try {
        const products = await productService.getProducts();
        const plainProducts = products.map(product => product.toObject({ getters: true }));
        res.render('realtimeproducts', { products: plainProducts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener productos en tiempo real desde MongoDB.' });
    }
};
