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

    async addProduct(title, description, price, thumbnail, code, stock) {
        try {
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                console.log("Todos los campos son obligatorios");
                return;
            }

            let existingProducts = await this.getProducts();
            const newId = existingProducts.length > 0 ? existingProducts[existingProducts.length - 1].id + 1 : 1;

            if (existingProducts.some(p => p.code === code)) {
                console.log(`Ya existe un producto con el código ${code}`);
            } else {
                let newProduct = {
                    id: newId,
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock
                };

                existingProducts.push(newProduct);

                await fs.writeFile(this.path, JSON.stringify(existingProducts, null, 2), 'utf-8');
                console.log(`Producto ${title} agregado correctamente.`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        return;
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
                console.log(`Producto con ID ${id} eliminado correctamente.`);
                console.log('Producto eliminado:', removedProduct[0]);
            } else {
                console.log(`No se encontró ningún producto con el ID ${id} para eliminar`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            let existingProducts = await this.getProducts();
            const indexToUpdate = existingProducts.findIndex(p => p.id === id);

            if (indexToUpdate !== -1) {
                updatedProduct.id = id;
                existingProducts[indexToUpdate] = updatedProduct;

                await fs.writeFile(this.path, JSON.stringify(existingProducts, null, 2), 'utf-8');
                console.log(`Producto con ID ${id} actualizado correctamente.`);
            } else {
                console.log(`No se encontró ningún producto con el ID ${id}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }    
}

const productManager = new ProductManager();

module.exports = ProductManager;