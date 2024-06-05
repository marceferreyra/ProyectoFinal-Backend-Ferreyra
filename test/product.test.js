const mongoose = require('mongoose');
const supertest = require('supertest');

const requester = supertest('http://localhost:8080');

describe('Testing Product API', () => {
    let expect;   

    before(async () => {
        await mongoose.connect('mongodb+srv://marceeferreyra:Marce507@coder-backend.osbdrri.mongodb.net/ecommerce', {
        });

        const chai = await import('chai');
        expect = chai.expect;
    });

    after(async () => {
        await mongoose.disconnect();
    });

    it("Agregar un producto: El API POST /api/products debe crear un producto correctamente", async () => {
        const productMock = {
            title: "Pelota de Futbol",
            description: "Pelota de futbol de cuero Nº 5 ADIDAS",
            price: 50000,
            code: "SKU 000415405044",
            stock: 15,
            thumbnails: [
                "/images/sin-imagen.jpg",
                "/images/sin-imagen-2.png"
            ],
            status: true,
            category: "accesorios",
            owner: ""
        };

        const response = await requester.post('/api/products').send(productMock);

        expect(response.status).to.eql(201);
        expect(response.body.message).to.eql(`Producto ${productMock.title} agregado correctamente.`);
    });

    it("Obtener productos: El API GET /api/products debe devolver una lista de productos", async () => {
        const response = await requester.get('/api/products');

        expect(response.status).to.eql(200);
        expect(response.body).to.have.property("status", "success");
        expect(response.body).to.have.property("payload").that.is.an("array");
    });

    it("Obtener producto por ID: El API GET /api/products/:id debe devolver un producto específico", async () => {
        const productId = '65c40fc377d246e0be124370';

        const response = await requester.get(`/api/products/${productId}`);

        expect(response.status).to.eql(200);
        expect(response.body).to.have.property("_id", productId);
        expect(response.body).to.have.property("title", "ZAPATILLAS RUNNING ADIDAS DURAMO SL 10 NEGRA");
        expect(response.body).to.have.property("description", "Mantené tus pies cómodos y tu estilo impecable en todo momento con estas zapatillas ADIDAS. Usalas con tus shorts de running favoritos para lucir un look deportivo y casual. El exterior de malla ayuda a mantener tus pies frescos, mientras que la amortiguación ultraliviana te ofrece soporte en cada uno de tus pasos. Hechas con una serie de materiales reciclados, su exterior incorpora al menos un 50 % de contenido reciclado. Este producto representa solo una de nuestras soluciones para acabar con los residuos plásticos.");
        expect(response.body).to.have.property("price", 74999);
    });
});

