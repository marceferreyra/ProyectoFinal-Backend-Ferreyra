const express = require('express');
const cartController = require('../dao/db/controllers/cartController');
const renderCartView = require(`./carts.view`)
const authorize = require('../config/middlewares');

const cartRouter = express.Router();

cartRouter.get('/',   cartController.getAllCarts);
cartRouter.post('/', cartController.createCart);
cartRouter.get('/:cid', renderCartView, cartController.getCartById);
cartRouter.put('/:cid', cartController.updateCartById);
cartRouter.delete('/:cid', cartController.deleteCartById);
cartRouter.post('/:cid/products/:pid', cartController.addProductToCart);
cartRouter.put('/:cid/products/:pid', cartController.updateProductQuantityInCart);
cartRouter.delete('/:cid/products/:pid', cartController.deleteProductFromCart);
cartRouter.get('/:cid/clear', cartController.clearCart);
cartRouter.get('/:cid/purchase', cartController.purchaseCart);

module.exports = cartRouter;
