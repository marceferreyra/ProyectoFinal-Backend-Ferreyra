const Product = require('./models/productModel');

class ProductManagerMongo {
    constructor() {
    }

    async getProducts() {
        try {
            const products = await Product.find();
            return products || [];
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            throw error;
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock, status, category) {
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
            });

            console.log(`Producto ${title} agregado correctamente.`);
            return { message: `Producto ${title} agregado correctamente.` };
        } catch (error) {
            console.error('Error:', error);
            return { error };
        }
    }


    async getProductById(id) {
        try {
            const product = await Product.findById(id);
            if (product) {
                console.log(`Producto encontrado con ID ${id}`);
                return product;
            } else {
                console.log(`No se encontró ningún producto con el ID ${id}`);
                return null;
            }
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
    
    async deleteProduct(id) {
        try {
            const removedProduct = await Product.findByIdAndDelete(id);

            if (removedProduct) {
                return {
                    message: `Producto con ID ${id} eliminado correctamente.`,
                    removedProduct,
                };
            } else {
                return { error: `No se encontró ningún producto con el ID ${id} para eliminar` };
            }
        } catch (error) {
            console.error('Error:', error);
            return { error };
        }
    }

    async updateProduct(id, updatedProduct) {
        try {

            const existingProduct = await Product.findById(id);

            if (existingProduct) {
                Object.assign(existingProduct, updatedProduct);

                await existingProduct.save();

                console.log(`Producto con ID ${id} actualizado correctamente.`);
                return { message: `Producto con ID ${id} actualizado correctamente.` };
            } else {
                return { error: `No se encontró ningún producto con el ID ${id}` };
            }
        } catch (error) {
            console.error('Error:', error);
            return { error };
        }
    }


}

const productManagerMongo = new ProductManagerMongo();

module.exports = productManagerMongo;
