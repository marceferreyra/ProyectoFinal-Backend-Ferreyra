const Product = require('../models/productModel');
const mongoose = require('mongoose')

class RealTimeProductService {
    constructor() {}

    async getRealTimeProducts(req) {
        try {
            const { limit = 10, page = 1, category, status, owner, sort } = req.query;
            const filters = {};

            if (category) filters.category = category;
            if (status) filters.status = status === 'true'; 
            if (owner) filters.owner = owner;

            const options = {
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
            };

            if (sort) {
                options.sort = { price: sort === 'asc' ? 1 : -1 };
            }

            const products = await Product.paginate(filters, options);
            return products;
        } catch (error) {
            req.logger.error('Error al obtener los productos en tiempo real:', error);
            throw error;
        }
    }
}

module.exports = RealTimeProductService;
