const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Ticket = require('../models/ticketModel');

class CartService {
    constructor() { }

    async getCarts(req) {
        try {
            const carts = await Cart.find();
            return carts || [];
        } catch (error) {
            req.logger.error('Error al obtener los carritos:', error);
            throw error;
        }
    }

    async saveCarts(carts, req) {
        try {
            await Cart.insertMany(carts);
            req.logger.info('Carritos guardados correctamente.');
            return { message: 'Carritos guardados correctamente.' };
        } catch (error) {
            req.logger.error('Error al guardar los carritos:', error);
            throw error;
        }
    }

    async createCart(req) {
        try {
            const newCart = await Cart.create({ products: [] });
            req.logger.info('Carrito creado:', newCart);
            return newCart;
        } catch (error) {
            req.logger.error('Error al crear el carrito:', error);
            throw error;
        }
    }

    async getCartById(cartId, req) {
        try {
            const cart = await Cart.findById(cartId);

            if (cart) {
                const simplifiedCart = {
                    _id: cart._id,
                    products: cart.products.map(product => ({
                        product: product.product,
                        quantity: product.quantity
                    }))
                };

                req.logger.info(`Carrito encontrado con ID ${cartId}`);
                return simplifiedCart;
            } else {
                req.logger.warning(`No se encontró ningún carrito con el ID ${cartId}`);
                return null;
            }
        } catch (error) {
            req.logger.error('Error al obtener el carrito:', error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, req, quantity = 1) {
        try {
            const cart = await Cart.findById(cartId);
            const userId = req.session.user._id; 
    
            if (cart) {
                const product = await Product.findById(productId);
    
                if (!product) {
                    req.logger.warning(`No se encontró ningún producto con el ID ${productId}`);
                    return { error: `No se encontró ningún producto con el ID ${productId}` };
                }
    
                if (product.owner && product.owner.toString() === userId) {
                    req.logger.warning(`El producto con ID ${productId} pertenece al usuario y no puede ser agregado al carrito.`);
                    return { error: `No puedes agregar tu propio producto al carrito.` };
                }
    
                const existingProduct = cart.products.find(p =>p.product.equals(productId));
    
                if (existingProduct) {
                    existingProduct.quantity += quantity; 
                } else {
                    cart.products.push({ product: productId, quantity });
                }
    
                await cart.save();
    
                req.logger.info(`Producto agregado al carrito ${cartId} correctamente.`);
    
                return { message: `Producto agregado al carrito ${cartId} correctamente.`, quantity: cart.products.length };
            } else {
                req.logger.warning(`No se encontró ningún carrito con el ID ${cartId}`);
                return { error: `No se encontró ningún carrito con el ID ${cartId}` };
            }
        } catch (error) {
            req.logger.error('Error al agregar producto al carrito:', error);
            throw error;
        }
    }

    async deleteProductFromCart(cartId, productId, req) {
        try {
            const cart = await Cart.findById(cartId);

            if (cart) {
                const existingProduct = cart.products.find((product) => product.product.equals(productId));

                if (existingProduct) {
                    if (existingProduct.quantity > 1) {
                        existingProduct.quantity -= 1;
                    } else {
                        cart.products = cart.products.filter((product) => !product.product.equals(productId));
                    }

                    await cart.save();
                    req.logger.info(`Producto eliminado del carrito ${cartId} correctamente.`);
                    return cart;
                } else {
                    req.logger.warning(`No se encontró el producto con el ID ${productId} en el carrito ${cartId}`);
                    return cart;
                }
            } else {
                throw new Error(`No se encontró ningún carrito con el ID ${cartId}`);
            }
        } catch (error) {
            req.logger.error('Error al eliminar producto del carrito:', error);
            throw error;
        }
    }

    async deleteCart(cartId, req) {
        try {
            const removedCart = await Cart.findByIdAndDelete(cartId);

            if (removedCart) {
                req.logger.info(`Carrito con ID ${cartId} eliminado correctamente.`);
                return {
                    message: `Carrito con ID ${cartId} eliminado correctamente.`,
                    removedCart,
                };
            } else {
                req.logger.warning(`No se encontró ningún carrito con el ID ${cartId} para eliminar`);
                return { error: `No se encontró ningún carrito con el ID ${cartId} para eliminar` };
            }
        } catch (error) {
            req.logger.error('Error al eliminar el carrito:', error);
            throw error;
        }
    }

    async updateProductQuantityInCart(cartId, productId, req, quantity) {
        try {
            const cart = await Cart.findById(cartId);

            if (cart) {
                const existingProduct = cart.products.find((product) => product.product.equals(productId));

                if (existingProduct) {
                    existingProduct.quantity = quantity;

                    await cart.save();
                    req.logger.info(`Cantidad del producto ${productId} actualizada en el carrito ${cartId} correctamente.`);
                    return { message: `Cantidad del ${productId} actualizada en el carrito ${cartId} correctamente.` };
                } else {
                    req.logger.warning(`No se encontró el producto con el ID ${productId} en el carrito ${cartId}`);
                    return { error: `No se encontró el producto con el ID ${productId} en el carrito ${cartId}` };
                }
            } else {
                req.logger.warning(`No se encontró ningún carrito con el ID ${cartId}`);
                return { error: `No se encontró ningún carrito con el ID ${cartId}` };
            }
        } catch (error) {
            req.logger.error('Error al actualizar la cantidad del producto en el carrito:', error);
            throw error;
        }
    }

    async clearCart(cartId, req) {
        try {
            const cart = await Cart.findById(cartId);

            if (cart) {
                cart.products = [];
                await cart.save();
                req.logger.info(`Carrito con ID ${cartId} vaciado correctamente.`);
                return { message: `Carrito con ID ${cartId} vaciado correctamente.` };
            } else {
                req.logger.warning(`No se encontró ningún carrito con el ID ${cartId}`);
                return { error: `No se encontró ningún carrito con el ID ${cartId}` };
            }
        } catch (error) {
            req.logger.error('Error al vaciar el carrito:', error);
            throw error;
        }
    }

    async purchaseCart(cartId, purchaserId, req) {
        function generateUniqueCode() {
            const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
            const timestamp = Date.now();
            const uniqueCode = `${timestamp}-${randomString}`;
            return uniqueCode;
        }

        try {
            const cart = await Cart.findById(cartId).populate('products.product');
            const productsToPurchase = [];
            const productsNotPurchased = [];

            for (const cartProduct of cart.products) {
                const product = await Product.findById(cartProduct.product);

                if (product.stock >= cartProduct.quantity) {
                    productsToPurchase.push({
                        product: cartProduct.product,
                        quantity: cartProduct.quantity
                    });
                    product.stock -= cartProduct.quantity;
                    await product.save();
                } else {
                    productsNotPurchased.push(cartProduct.product);
                }
            }

            const totalPrice = productsToPurchase.reduce((total, p) => total + (p.quantity * p.product.price), 0);

            const ticket = await Ticket.create({
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: totalPrice,
                purchaser: purchaserId
            });

            cart.products = cart.products.filter(cp => !productsToPurchase.map(p => p.product.toString()).includes(cp.product.toString()));
            await cart.save();
            req.logger.info('Compra realizada con éxito');
            return { ticket, productsNotPurchased };
        } catch (error) {
            req.logger.error('Error al finalizar la compra:', error);
            throw error;
        }
    }
}

module.exports = new CartService();
