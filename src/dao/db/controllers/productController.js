const CustomError = require('../services/errors/customErrors');
const EErrors = require('../services/errors/enumErrors');
const errorInfo = require('../services/errors/info');

const productService = require('../services/productService');

exports.getProducts = async (req, res) => {
    try {
        const products = await productService.getProducts(req);

        const { docs, totalPages, page, hasPrevPage, hasNextPage, prevPage, nextPage } = products;
        const limit = req.query.limit || 10;
        const category = req.query.category || '';
        const status = req.query.status || '';
        const owner = req.query.owner || '';
        const sort = req.query.sort || '';

        const createLink = (pageNum) => `/api/products?page=${pageNum}&limit=${limit}&category=${category}&status=${status}&owner=${owner}&sort=${sort}`;

        res.status(200).json({
            status: 'success',
            payload: docs,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink: hasPrevPage ? createLink(prevPage) : null,
            nextLink: hasNextPage ? createLink(nextPage) : null,
        });
    } catch (error) {
        req.logger.error('Error en el controlador de obtener productos:', error);
        CustomError.createError({
            name: 'GetProductsError',
            message: errorInfo[EErrors.GET_PRODUCTS_ERROR],
            code: EErrors.GET_PRODUCTS_ERROR,
            cause: error.message
        });
        res.status(500).json({ error: 'Error al obtener productos', message: error.message });
    }
};

exports.getProductById = async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await productService.getProductById(productId, req);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({
                status: 'error',
                error: `No se encontró ningún producto con el ID ${productId}`,
            });
        }
    } catch (error) {
        req.logger.error(error);
        CustomError.createError({
            name: 'GetProductByIdError',
            message: errorInfo[EErrors.GET_PRODUCT_BY_ID_ERROR],
            code: EErrors.GET_PRODUCT_BY_ID_ERROR,
            cause: error.message
        });
        res.status(500).json({ error: 'Error al obtener el producto', message: error.message });
    }
};

exports.addProduct = async (req, res) => {
    const { title, description, price, thumbnails, code, stock, status, category } = req.body;
    const owner = req.session.user ? req.session.user._id : null; 

    try {
        const result = await productService.addProduct(title, description, price, thumbnails, code, stock, status, category, owner, req);

        if (result.error) {
            res.status(400).json({ error: result.error });
        } else {
            res.status(201).json({ message: result.message, product: result.product });
        }
    } catch (error) {
        req.logger.error('Error:', error);
        CustomError.createError({
            name: 'AddProductError',
            message: errorInfo[EErrors.ADD_PRODUCT_ERROR],
            code: EErrors.ADD_PRODUCT_ERROR,
            cause: error.message
        });
        res.status(500).json({ error: 'Error al agregar el producto', message: error.message });
    }
};


exports.deleteProduct = async (req, res) => {
    const productId = req.params.id;
    const userId = req.session.user ? req.session.user._id : null;

    try {
        const product = await productService.getProductById(productId, req);
        
        if (!product) {
            return res.status(404).json({ error: `No se encontró ningún producto con el ID ${productId}` });
        }

        if (product.owner.equals(userId) || req.session.user.role === 'admin') {
            const result = await productService.deleteProduct(productId, req);
            if (result.error) {
                return res.status(404).json({ error: result.error });
            } else {
                return res.status(200).json({ message: `Producto con ID ${productId} eliminado` });
            }
        } else {
            return res.status(403).json({ error: 'No tienes permiso para eliminar este producto' });
        }
    } catch (error) {
        req.logger.error('Error:', error);
        CustomError.createError({
            name: 'DeleteProductError',
            message: errorInfo[EErrors.DELETE_PRODUCT_ERROR],
            code: EErrors.DELETE_PRODUCT_ERROR,
            cause: error.message
        });
        return res.status(500).json({ error: 'Error al eliminar el producto', message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    const productId = req.params.id;
    const updatedProduct = req.body;

    try {
        const result = await productService.updateProduct(productId, updatedProduct, req);

        if (result.error) {
            res.status(404).json({ error: result.error });
        } else {
            res.status(200).json({ message: result.message });
        }
    } catch (error) {
        req.logger.error('Error:', error);
        CustomError.createError({
            name: 'UpdateProductError',
            message: errorInfo[EErrors.UPDATE_PRODUCT_ERROR],
            code: EErrors.UPDATE_PRODUCT_ERROR,
            cause: error.message
        });
        res.status(500).json({ error: 'Error al actualizar el producto', message: error.message });
    }
};
