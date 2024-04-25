const Cart = require('../models/cartModel');
const Product = require(`../models/productModel`)
const Ticket = require(`../models/ticketModel`)

class CartService {
    constructor() { }

    async getCarts() {
        try {
            const carts = await Cart.find();
            return carts || [];
        } catch (error) {
            console.error('Error al obtener los carritos:', error);
            throw error;
        }
    }

    async saveCarts(carts) {
        try {
            await Cart.insertMany(carts);
            console.log('Carritos guardados correctamente.');
            return { message: 'Carritos guardados correctamente.' };
        } catch (error) {
            console.error('Error al guardar los carritos:', error);
            throw error;
        }
    }

    async createCart() {
        try {
            const newCart = await Cart.create({ products: [] });
            console.log('Carrito creado:', newCart);
            return newCart;
        } catch (error) {
            console.error('Error al crear el carrito:', error);
            throw error;
        }
    }

    async getCartById(cartId) {
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

                console.log(`Carrito encontrado con ID ${cartId}`);
                return simplifiedCart;
            } else {
                console.log(`No se encontró ningún carrito con el ID ${cartId}`);
                return null;
            }
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            throw error;
        }
    }


    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await Cart.findById(cartId);

            if (cart) {
                const existingProductIndex = cart.products.findIndex((p) => p.product.equals(productId));

                if (existingProductIndex !== -1) {
                    cart.products[existingProductIndex].quantity += quantity;
                } else {
                    cart.products.push({ product: productId, quantity });
                }

                await cart.save();

                console.log(`Producto agregado al carrito ${cartId} correctamente.`);

                return { message: `Producto agregado al carrito ${cartId} correctamente.`, quantity: cart.products.length };
            } else {
                return { error: `No se encontró ningún carrito con el ID ${cartId}` };
            }
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            throw error;
        }
    }


    async deleteProductFromCart(cartId, productId) {
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
                    console.log(`Producto eliminado del carrito ${cartId} correctamente.`);
                    return cart;
                } else {
                    console.log(`No se encontró el producto con el ID ${productId} en el carrito ${cartId}`);
                    return cart;
                }
            } else {
                throw new Error(`No se encontró ningún carrito con el ID ${cartId}`);
            }
        } catch (error) {
            console.error('Error al eliminar producto del carrito:', error);
            throw error;
        }
    }
    
    

    async deleteCart(cartId) {
        try {
            const removedCart = await Cart.findByIdAndDelete(cartId);

            if (removedCart) {
                return {
                    message: `Carrito con ID ${cartId} eliminado correctamente.`,
                    removedCart,
                };
            } else {
                return { error: `No se encontró ningún carrito con el ID ${cartId} para eliminar` };
            }
        } catch (error) {
            console.error('Error al eliminar el carrito:', error);
            throw error;
        }
    }

    async updateProductQuantityInCart(cartId, productId, quantity) {
        try {
            const cart = await Cart.findById(cartId);
    
            if (cart) {
                const existingProduct = cart.products.find((product) => product.product.equals(productId));
    
                if (existingProduct) {
                    existingProduct.quantity = quantity; 
    
                    await cart.save();
                    console.log(`Cantidad del producto ${productId} actualizada en el carrito ${cartId} correctamente.`);
                    return { message: `Cantidad del ${productId} actualizada en el carrito ${cartId} correctamente.` };
                } else {
                    console.log(`No se encontró el producto con el ID ${productId} en el carrito ${cartId}`);
                    return { error: `No se encontró el producto con el ID ${productId} en el carrito ${cartId}` };
                }
            } else {
                console.log(`No se encontró ningún carrito con el ID ${cartId}`);
                return { error: `No se encontró ningún carrito con el ID ${cartId}` };
            }
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto en el carrito:', error);
            throw error;
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await Cart.findById(cartId);
    
            if (cart) {
                cart.products = []; // Vaciar el array de productos del carrito
                await cart.save();
                console.log(`Carrito con ID ${cartId} vaciado correctamente.`);
                return { message: `Carrito con ID ${cartId} vaciado correctamente.` };
            } else {
                return { error: `No se encontró ningún carrito con el ID ${cartId}` };
            }
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            throw error;
        }
    }

    async purchaseCart(cartId, purchaserId) {
        // Define la función generateUniqueCode dentro de purchaseCart
        function generateUniqueCode() {
            // Implementa la lógica para generar un código único
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
                code: generateUniqueCode(), // Utiliza la función para generar el código único
                purchase_datetime: new Date(),
                amount: totalPrice,
                purchaser: purchaserId
            });
    
            cart.products = cart.products.filter(cp => !productsToPurchase.map(p => p.product.toString()).includes(cp.product.toString()));
            await cart.save();
    
            return { ticket, productsNotPurchased };
        } catch (error) {
            console.error('Error al finalizar la compra:', error);
            throw error;
        }
    }
       
    
    
}



const cartService = new CartService();

module.exports = cartService;