const fs = require('fs').promises;

class ProductManager {
    constructor() {
        this.path = './db/products.json';
    }

    async getProducts() {
        try {
            const fileExists = await fs.access(this.path)
                .then(() => true)
                .catch(() => false);

            if (!fileExists) {
                await fs.writeFile(this.path, '[]', 'utf-8');
            }

            const data = await fs.readFile(this.path, 'utf-8');
            const products = JSON.parse(data);

            return products || [];
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            throw error;
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock, status, category) {
        try {
            if (!title || !description || !price || !thumbnail || !code || !stock || !status || !category) {
                return { error: "Todos los campos son obligatorios" };
            }

            let existingProducts = await this.getProducts();
            const newId = existingProducts.length > 0 ? existingProducts[existingProducts.length - 1].id + 1 : 1;

            if (existingProducts.some(p => p.code === code)) {
                console.log(`Ya existe un producto con el código ${code}`)
                return { error: `Ya existe un producto con el código ${code}` };

            } else {
                let newProduct = {
                    id: newId,
                    title,
                    description,
                    price,
                    code,
                    stock,
                    thumbnails: [thumbnail],
                    status: true,
                    category,
                };

                if (existingProducts.some(p => p.id === newId && p.thumbnails)) {
                    const existingProduct = existingProducts.find(p => p.id === newId);
                    newProduct.thumbnails = [...existingProduct.thumbnails, thumbnail];
                }

                existingProducts.push(newProduct);

                await fs.writeFile(this.path, JSON.stringify(existingProducts, null, 2), 'utf-8');
                console.log(`Producto ${title} agregado correctamente.`)
                return { message: `Producto ${title} agregado correctamente.` };
            }
        } catch (error) {
            console.error('Error:', error);
            return { error: 'Error interno del servidor.' };
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProducts();
            const product = products.find(p => p.id === id);

            if (product) {
                console.log('Producto encontrado:');
                console.log(product);
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
            let existingProducts = await this.getProducts();
            const indexToRemove = existingProducts.findIndex(p => p.id === id);

            if (indexToRemove !== -1) {
                const removedProduct = existingProducts.splice(indexToRemove, 1);
                await fs.writeFile(this.path, JSON.stringify(existingProducts, null, 2), 'utf-8');
                return {
                    message: `Producto con ID ${id} eliminado correctamente.`,
                    removedProduct: removedProduct[0],
                };
            } else {
                return { error: `No se encontró ningún producto con el ID ${id} para eliminar` };
            }
        } catch (error) {
            console.error('Error:', error);
            return { error: 'Error interno del servidor.' };
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            let existingProducts = await this.getProducts();
            const indexToUpdate = existingProducts.findIndex(p => p.id === id);

            if (indexToUpdate !== -1) {
                if (id !== updatedProduct.id) {
                    return { error: "No se puede modificar el ID del producto." };
                }

                existingProducts[indexToUpdate] = {
                    ...existingProducts[indexToUpdate],
                    ...updatedProduct,
                    id: id,
                };

                await fs.writeFile(this.path, JSON.stringify(existingProducts, null, 2), 'utf-8');
                return { message: `Producto con ID ${id} actualizado correctamente.` };
            } else {
                return { error: `No se encontró ningún producto con el ID ${id}` };
            }
        } catch (error) {
            console.error('Error:', error);
            return { error: 'Error interno del servidor.' };
        }
    }
}

const productManager = new ProductManager();

module.exports = ProductManager;