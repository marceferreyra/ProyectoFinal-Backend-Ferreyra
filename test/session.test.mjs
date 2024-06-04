import mongoose from 'mongoose';
import supertest from 'supertest';
import { expect } from 'chai';

const requester = supertest('http://localhost:8080');

describe('Testing Session API', () => {
    before(async () => {
        await mongoose.connect('mongodb+srv://marceeferreyra:Marce507@coder-backend.osbdrri.mongodb.net/ecommerce', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });

    after(async () => {
        await mongoose.disconnect();
    });

    describe('Register User', () => {
        it('debería registrar un nuevo usuario', async () => {
            const userMock = {
                first_name: "Test",
                last_name: "User",
                email: "testuser@example.com",
                age: 30,
                password: "password123"
            };

            const response = await requester.post('/api/sessions/register').send(userMock);

            expect(response.status).to.eql(302);
            expect(response.headers.location).to.eql('/api/sessions/login');
        });

        it('no debería registrar un usuario con email existente', async () => {
            const userMock = {
                first_name: "Test",
                last_name: "User",
                email: "testuser@example.com",
                age: 30,
                password: "password123"
            };

            const response = await requester.post('/api/sessions/register').send(userMock);

            expect(response.status).to.eql(400);
            expect(response.body).to.have.property('error', 'El usuario ya existe. Inicia sesión.');
        });
    });

    describe('Login User', () => {
        it('no debería iniciar sesión con contraseña incorrecta', async () => {
            const userCredentials = {
                email: "testuser@example.com",
                password: "wrongpassword"
            };

            const response = await requester.post('/api/sessions/login').send(userCredentials);

            expect(response.status).to.eql(401);
            expect(response.body).to.have.property('error', 'Credenciales inválidas');
        });

        it('no debería iniciar sesión con un usuario inexistente', async () => {
            const userCredentials = {
                email: "nonexistentuser@example.com",
                password: "password123"
            };

            const response = await requester.post('/api/sessions/login').send(userCredentials);

            expect(response.status).to.eql(401);
            expect(response.body).to.have.property('error', 'El usuario no existe. Regístrate para iniciar sesión');
        });
    });

    describe('Logout User', () => {
        let cookie;

        before(async () => {
            const response = await requester.post('/api/sessions/login').send({
                email: "testuser@example.com",
                password: "password123"
            });
            cookie = response.headers['set-cookie'];
        });

        it('debería cerrar la sesión del usuario', async () => {
            const response = await requester.get('/api/sessions/logout').set('Cookie', cookie);

            expect(response.status).to.eql(302);
            expect(response.headers.location).to.eql('/api/sessions/login');
        });
    });
});
