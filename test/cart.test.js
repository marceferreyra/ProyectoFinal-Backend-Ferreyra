const mongoose = require('mongoose');
const supertest = require('supertest');

const requester = supertest('http://localhost:8080');

describe('Testing Cart API', () => {
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

    it("Crear un carrito: El API POST /api/carts debe crear un carrito correctamente", async () => {
        const response = await requester.post('/api/carts');

        expect(response.status).to.eql(201);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('_id');
    });

    it("Obtener todos los carritos: El API GET /api/carts debe devolver una lista de carritos", async () => {
        const response = await requester.get('/api/carts');

        expect(response.status).to.eql(200);
        expect(response.body).to.be.an("array");
    });

    it("Obtener carrito por ID: El API GET /api/carts/:id debe devolver un carrito específico", async () => {
        const cartId = '65fae022b79ecb718b72106a'; 
        
        const response = await requester.get(`/api/carts/${cartId}`);
        
        expect(response.status).to.eql(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('_id', cartId);
    });
});

