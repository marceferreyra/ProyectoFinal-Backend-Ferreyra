const fs = require('fs').promises;

class CartManager {
    constructor() {
        this.path = './db/carts.json';
    }

    async getCarts() {
        try {
            const fileExists = await fs.access(this.path)
                .then(() => true)
                .catch(() => false);

            if (!fileExists) {
                await fs.writeFile(this.path, '[]', 'utf-8');
            }

            const data = await fs.readFile(this.path, 'utf-8');
            const carts = JSON.parse(data);

            return carts || [];
        } catch (error) {
            console.error('Error al obtener los carritos:', error);
            throw error;
        }
    }

    async saveCarts(carts) {
        try {
            await fs.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8');
        } catch (error) {
            console.error('Error al guardar los carritos:', error);
            throw error;
        }
    }

    async createCart() {
        try {
            const carts = await Cart.find();
            const newCartId = carts.length > 0 ? carts[carts.length - 1].cartId + 1 : 1;
    
            const newCart = await Cart.create({
                cartId: newCartId,
                products: [],
            });
    
            console.log('Carrito creado:', newCart);
            return newCart;
        } catch (error) {
            console.error('Error al crear el carrito:', error);
            throw error;
        }
    }

    async getCartById(cartId) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(c => c.id === cartId);

            return cart;
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const carts = await this.getCarts();
            const cartIndex = carts.findIndex(c => c.id === cartId);

            if (cartIndex !== -1) {
                const cart = carts[cartIndex];
                const existingProductIndex = cart.products.findIndex(p => p.product === productId);

                if (existingProductIndex !== -1) {
                    cart.products[existingProductIndex].quantity += quantity;
                } else {
                    cart.products.push({
                        product: productId,
                        quantity: quantity,
                    });
                }

                await this.saveCarts(carts);
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
            const carts = await this.getCarts();
            const cartIndex = carts.findIndex(c => c.id === cartId);

            if (cartIndex !== -1) {
                const cart = carts[cartIndex];
                const existingProductIndex = cart.products.findIndex(p => p.product === productId);

                if (existingProductIndex !== -1) {
                    cart.products[existingProductIndex].quantity--;

                    if (cart.products[existingProductIndex].quantity === 0) {
                        cart.products.splice(existingProductIndex, 1);
                    }

                    await this.saveCarts(carts);
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
            const carts = await this.getCarts();
            const cartIndex = carts.findIndex(c => c.id === cartId);

            if (cartIndex !== -1) {
                carts.splice(cartIndex, 1);
                await this.saveCarts(carts);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error al eliminar el carrito:', error);
            throw error;
        }
    }
}

module.exports = CartManager;
