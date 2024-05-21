const Product = require('../models/productModel');

class ProductService {
    constructor() {
    }

    async getProducts(logger) {
        try {
            const products = await Product.find();
            return products || [];
        } catch (error) {
            logger.error('Error al obtener los productos:', error);
            throw error;
        }
    }
    
    async getProductById(id, logger) {
        try {
            logger.info(`Buscando producto con ID ${id}`);
            const product = await Product.findById(id);
            if (product) {
                logger.info(`Producto encontrado con ID ${id}`);
                return product;
            } else {
                logger.warning(`No se encontró ningún producto con el ID ${id}`);
                return null;
            }
        } catch (error) {
            logger.error('Error al buscar el producto:', error);
            throw error;  
        }
    }
    
    async addProduct(title, description, price, thumbnail, code, stock, status, category, owner, logger) {
        try {

            await Product.create({
                title,
                description,
                price,
                code,
                stock,
                thumbnails: [thumbnail],
                status: true,
                category,
                owner
            });

            logger.info(`Producto ${title} agregado correctamente.`);
            return { message: `Producto ${title} agregado correctamente.` };
        } catch (error) {
            logger.error('Error:', error);
            return { error };
        }
    }

    async deleteProduct(id, logger) {
        try {
            const removedProduct = await Product.findByIdAndDelete(id);

            if (removedProduct) {
                logger.info(`Producto ${id} eliminado correctamente.`);
                return {                    
                    message: `Producto con ID ${id} eliminado correctamente.`,
                    removedProduct,
                };
            } else {
                logger.warning(`No se encontró ningún producto con el ID ${id} para eliminar.`);
                return { error: `No se encontró ningún producto con el ID ${id} para eliminar.` };
            }
        } catch (error) {
            logger.error('Error:', error);
            return { error };
        }
    }

    async updateProduct(id, updatedProduct, logger) {
        try {

            const existingProduct = await Product.findById(id);

            if (existingProduct) {
                Object.assign(existingProduct, updatedProduct);

                await existingProduct.save();

                logger.info(`Producto con ID ${id} actualizado correctamente.`);
                return { message: `Producto con ID ${id} actualizado correctamente.` };
            } else {
                logger.warning(`No se encontró ningún producto con el ID ${id}`);
                return { error: `No se encontró ningún producto con el ID ${id}` };
            }
        } catch (error) {
            logger.error('Error:', error);
            return { error };
        }
    }
}

const productService = new ProductService();

module.exports = productService;

