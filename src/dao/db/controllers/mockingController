const mockingService = require('../services/mockingService');

exports.getMockingProducts = (req, res) => {
    const products = mockingService.generateProducts(100);
    res.render('mocking', { products });
};