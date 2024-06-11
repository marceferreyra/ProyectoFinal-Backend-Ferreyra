const RealTimeProductService = require('../services/realTimeProductService');

exports.getRealTimeProducts = async (req, res) => {
    try {
        const realTimeProductService = new RealTimeProductService();
        const products = await realTimeProductService.getRealTimeProducts(req);
        const plainProducts = products.docs.map(product => product.toObject({ getters: true }));
        res.render('realtimeproducts', { products: plainProducts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener productos en tiempo real desde MongoDB.' });
    }
};