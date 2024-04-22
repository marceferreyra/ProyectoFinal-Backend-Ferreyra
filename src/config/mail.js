const express = require('express');
const nodemailer = require('nodemailer')

const mailRouter = express.Router();

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: "marceeferreyra@gmail.com",
        pass: "qxdjqqquughitrbp",
    },
    tls: {
        rejectUnauthorized: false
    }
})

mailRouter.post('/', async (req, res) => {
    try {
        const message = await transporter.sendMail({
            from: 'Coder Test <marceeferreyra@gmail>',
            to: 'nymarce11@hotmail.com',
            subject: 'Prueba Coder',
            text: 'Hola!! Probando!!',
            html: `<div>
            <h1>Hola! Probando!!</h1>
            </div>`,
            attachments: []
        });
        console.log('Correo enviado:', message.response);
        res.send('Correo enviado correctamente.');
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).send('Error al enviar el correo.');
    }
});

module.exports = mailRouter