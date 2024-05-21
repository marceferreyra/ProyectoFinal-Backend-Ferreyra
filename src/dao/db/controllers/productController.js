const CustomError = require('../services/errors/customErrors');
const EErrors = require('../services/errors/enumErrors');
const errorInfo = require('../services/errors/info');

const productService = require('../services/productService');

exports.getProducts = async (req, res) => {
    try {
        const products = await productService.getProducts(req.logger);
        const plainProducts = products.map(product => product.toObject({ getters: true }));
        const user = req.session.user;
        const cartId = user ? user.cartId : null; 
        
        res.render('products', { products: plainProducts, user, cartId }); 
    } catch (error) {
        logger.error(error);
        CustomError.createError({
            name: 'GetProductsError',
            message: errorInfo[EErrors.GET_PRODUCTS_ERROR],
            code: EErrors.GET_PRODUCTS_ERROR,
            cause: error.message
        });
    }
};

exports.getProductById = async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await productService.getProductById(productId, req.logger);
        
        if (product) {    
            const user = req.session.user;
           
            const plainProduct = product.toObject({ getters: true }); 
          
            res.render('productDetail', { product: plainProduct, user }); 
        } else {
            const errorResponse = {
                status: 'error',
                error: `No se encontró ningún producto con el ID ${productId}`,
            };
            res.status(404).json(errorResponse);
        }
    } catch (error) {
        logger.error(error);
        CustomError.createError({
            name: 'GetProductByIdError',
            message: errorInfo[EErrors.GET_PRODUCT_BY_ID_ERROR],
            code: EErrors.GET_PRODUCT_BY_ID_ERROR,
            cause: error.message
        });
    }
};

exports.addProduct = async (req, res) => {
    const { title, description, price, thumbnail, code, stock, status, category, owner } = req.body;
    try {
        const result = await productService.addProduct(title, description, price, thumbnail, code, stock, status, category, owner, req.logger);

        if (result.error) {
            res.status(400).json({ error: result.error });
        } else {
            res.status(201).json({ message: result.message });
        }
    } catch (error) {
        logger.error('Error:', error);
        CustomError.createError({
            name: 'AddProductError',
            message: errorInfo[EErrors.ADD_PRODUCT_ERROR],
            code: EErrors.ADD_PRODUCT_ERROR,
            cause: error.message
        });
    }
};

exports.deleteProduct = async (req, res) => {
    const productId = req.params.id;

    try {
        const result = await productService.deleteProduct(productId, req.logger);

        if (result.error) {
            res.status(404).json({ error: result.error });
        } else {
            res.status(200).json({ message: result.message });
        }
    } catch (error) {
        logger.error('Error:', error);
        CustomError.createError({
            name: 'DeleteProductError',
            message: errorInfo[EErrors.DELETE_PRODUCT_ERROR],
            code: EErrors.DELETE_PRODUCT_ERROR,
            cause: error.message
        });
    }
};

exports.updateProduct = async (req, res) => {
    const productId = req.params.id;
    const updatedProduct = req.body;

    try {
        const result = await productService.updateProduct(productId, updatedProduct, req.logger);

        if (result.error) {
            res.status(404).json({ error: result.error });
        } else {
            res.status(200).json({ message: result.message });
        }
    } catch (error) {
        logger.error('Error:', error);
        CustomError.createError({
            name: 'UpdateProductError',
            message: errorInfo[EErrors.UPDATE_PRODUCT_ERROR],
            code: EErrors.UPDATE_PRODUCT_ERROR,
            cause: error.message
        });
    }
};
