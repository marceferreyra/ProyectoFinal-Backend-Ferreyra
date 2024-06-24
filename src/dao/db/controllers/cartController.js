const CustomError = require('../services/errors/customErrors');
const EErrors = require('../services/errors/enumErrors');
const errorInfo = require('../services/errors/info');

const CartService = require('../services/cartService');
const Cart = require('../models/cartModel');

exports.getAllCarts = async (req, res) => {
    try {
        const carts = await Cart.find().populate('products.product');

        if (carts.length > 0) {
            req.logger.info(`carritos activos: ${carts.length}`);
            const formattedResponse = JSON.stringify(carts, null, '\t');
            res.type('json').send(formattedResponse);
        } else {
            CustomError.createError({
                name: 'CartNotFoundError',
                message: errorInfo[EErrors.CART_NOT_FOUND],
                code: EErrors.CART_NOT_FOUND,
                cause: 'No se encontraron carritos en la base de datos'
            });
        }
    } catch (error) {
        logger.error(error);
        CustomError.createError({
            name: 'ServerInternalError',
            message: errorInfo[EErrors.SERVER_ERROR],
            code: EErrors.SERVER_ERROR,
            cause: error.message
        });
    }
};

exports.createCart = async (req, res) => {
    try {
        const newCart = await CartService.createCart(req);
        res.status(201).json(newCart);
    } catch (error) {
        req.logger.error('Error:', error);
        CustomError.createError({
            name: 'CartCreationError',
            message: errorInfo[EErrors.CART_CREATION_ERROR],
            code: EErrors.CART_CREATION_ERROR,
            cause: error.message
        });
        res.status(500).send({ error: 'Error al crear el carrito', message: error.message });
    }
};

exports.getCartById = async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await Cart.findById(cartId).populate('products.product');

        if (cart) {
            res.status(200).json(cart)
            
        } else {
            CustomError.createError({
                name: 'CartNotFoundError',
                message: errorInfo[EErrors.CART_NOT_FOUND],
                code: EErrors.CART_NOT_FOUND,
                cause: `No se encontró ningún carrito con el ID ${cartId}`
            });
        }
    } catch (error) {
        req.logger.error(error);
        CustomError.createError({
            name: 'ServerInternalError',
            message: errorInfo[EErrors.SERVER_ERROR],
            code: EErrors.SERVER_ERROR,
            cause: error.message
        });
    }
};

exports.updateCartById = async (req, res) => {
    const cartId = req.params.cid;

    try {
        const updatedCart = await Cart.findByIdAndUpdate(cartId, req.body, req, { new: true });
        res.status(200).json(updatedCart);
    } catch (error) {
        req.logger.error('Error:', error);
        CustomError.createError({
            name: 'CartUpdateError',
            message: errorInfo[EErrors.CART_UPDATE_ERROR],
            code: EErrors.CART_UPDATE_ERROR,
            cause: error.message
        });
    }
};

exports.deleteCartById = async (req, res) => {
    const cartId = req.params.cid;

    try {
        const result = await CartService.deleteCart(cartId, req);

        if (result.error) {
            res.status(404).json({ error: result.error });
        } else {
            res.status(200).json({ message: result.message });
        }
    } catch (error) {
        req.logger.error('Error:', error);
        CustomError.createError({
            name: 'CartDeletionError',
            message: errorInfo[EErrors.CART_DELETION_ERROR],
            code: EErrors.CART_DELETION_ERROR,
            cause: error.message
        });
    }
};

exports.addProductToCart = async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const result = await CartService.addProductToCart(cartId, productId, req);
        if (result.error) {
            res.status(400).json({ error: result.error }); 
        } else {
            res.status(200).json({ message: result.message });
        }
    } catch (error) {
        req.logger.error('Error:', error);
        CustomError.createError({
            name: 'ProductAdditionError',
            message: errorInfo[EErrors.PRODUCT_ADDITION_ERROR],
            code: EErrors.PRODUCT_ADDITION_ERROR,
            cause: error.message
        });
    }
};

exports.updateProductQuantityInCart = async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    try {
        const result = await CartService.updateProductQuantityInCart(cartId, productId, quantity, req);
        if (result.error) {
            res.status(404).json({ error: result.error });
        } else {
            res.status(200).json({ message: result.message });
        }
    } catch (error) {
        req.logger.error('Error:', error);
        CustomError.createError({
            name: 'ProductQuantityUpdateError',
            message: errorInfo[EErrors.PRODUCT_QUANTITY_UPDATE_ERROR],
            code: EErrors.PRODUCT_QUANTITY_UPDATE_ERROR,
            cause: error.message
        });
    }
};

exports.deleteProductFromCart = async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const result = await CartService.deleteProductFromCart(cartId, productId, req);

        if (result.error) {
            res.status(404).json({ error: result.error });
        } else {
            res.status(200).json({ message: result.message });
        }
    } catch (error) {
        req.logger.error('Error:', error);
        CustomError.createError({
            name: 'ProductDeletionError',
            message: errorInfo[EErrors.PRODUCT_DELETION_ERROR],
            code: EErrors.PRODUCT_DELETION_ERROR,
            cause: error.message
        });
    }
};

exports.clearCart = async (req, res) => {
    const cartId = req.params.cid;

    try {
        const result = await CartService.clearCart(cartId, req);

        if (result.error) {
            res.status(404).json({ error: result.error });
        } else {
            res.status(200).json({ message: result.message });
        }
    } catch (error) {
        req.logger.error('Error:', error);
        CustomError.createError({
            name: 'CartClearError',
            message: errorInfo[EErrors.CART_CLEAR_ERROR],
            code: EErrors.CART_CLEAR_ERROR,
            cause: error.message
        });
    }
};

exports.purchaseCart = async (req, res) => {
    const cartId = req.params.cid;
    const purchaserId = req.session.user;

    try {
        const { ticket, productsNotPurchased } = await CartService.purchaseCart(cartId, purchaserId, req);

        if (productsNotPurchased.length > 0) {
            res.status(200).json({ ticket, productsNotPurchased });
        } else {
            res.status(200).json({ ticket });
        }
    } catch (error) {
        req.logger.error('Error:', error);
        CustomError.createError({
            name: 'PurchaseError',
            message: errorInfo[EErrors.PURCHASE_ERROR],
            code: EErrors.PURCHASE_ERROR,
            cause: error.message
        });
    }
};