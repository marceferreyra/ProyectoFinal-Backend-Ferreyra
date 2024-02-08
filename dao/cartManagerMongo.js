const Cart = require('./models/cartModel');

class CartManagerMongo {
    constructor() {
            }

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
                    await Promise.all(carts.map(cart => cart.save()));
                } catch (error) {
                    console.error('Error al guardar los carritos:', error);
                    throw error;
                }
            }
        
            async createCart() {
                try {                    
                    const newCart = new Cart({ carts: [{ id: 1, products: [] }] });
                    await newCart.save();
        
                    return newCart;
                } catch (error) {
                    console.error('Error al crear el carrito:', error);
                    throw error;
                }
            }
        
            async getCartById(cartId) {
                try {                    
                    const cart = await Cart.findById(cartId);
                    return cart;
                } catch (error) {
                    console.error('Error al obtener el carrito:', error);
                    throw error;
                }
            }
        
            async addProductToCart(cartId, productId, quantity = 1) {
                try {                    
                    const cart = await Cart.findById(cartId);
        
                    if (cart) {
                        const existingProduct = cart.carts[0].products.find(p => p.product.equals(productId));
        
                        if (existingProduct) {
                            existingProduct.quantity += quantity;
                        } else {
                            cart.carts[0].products.push({ product: productId, quantity });
                        }
        
                        await cart.save();
                        return cart;
                    } else {
                        throw new Error(`No se encontró ningún carrito con el ID ${cartId}`);
                    }
                } catch (error) {
                    console.error('Error al agregar producto al carrito:', error);
                    throw error;
                }
            }
        
            async deleteProductFromCart(cartId, productId) {
                try {
                    // Eliminar un producto del carrito
                    const cart = await Cart.findById(cartId);
        
                    if (cart) {
                        const existingProductIndex = cart.carts[0].products.findIndex(p => p.product.equals(productId));
        
                        if (existingProductIndex !== -1) {
                            const existingProduct = cart.carts[0].products[existingProductIndex];
                            existingProduct.quantity--;
        
                            if (existingProduct.quantity === 0) {
                                cart.carts[0].products.splice(existingProductIndex, 1);
                            }
        
                            await cart.save();
                            return cart;
                        } else {
                            throw new Error(`No se encontró ningún producto con el ID ${productId} en el carrito`);
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
                    const result = await Cart.findByIdAndDelete(cartId);
                    return !!result;
                } catch (error) {
                    console.error('Error al eliminar el carrito:', error);
                    throw error;
                }
            }
}

module.exports = CartManagerMongo;