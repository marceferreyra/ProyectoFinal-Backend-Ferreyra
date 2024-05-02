const faker = require('faker');

class MockingService {
    generateProducts(quantity) {
        const products = [];
        for (let i = 0; i < quantity; i++) {
            const product = {
                title: faker.commerce.productName(),
                description: faker.lorem.sentence(),
                price: faker.commerce.price(),
                thumbnails: [faker.image.imageUrl()],
                code: faker.random.alphaNumeric(8),
                stock: faker.datatype.number(),
                status: true,
                category: faker.random.arrayElement(['calzado', 'accesorios', 'camperas'])
            };
            products.push(product);
        }
        return products;
    }
}

module.exports = new MockingService();
