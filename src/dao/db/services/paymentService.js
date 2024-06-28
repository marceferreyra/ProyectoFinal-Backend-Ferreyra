const stripe = require('stripe');
const config = require('../../../config/config');

class PaymentService {
    constructor() {
        this.stripe = stripe(process.env.STRIPE_SECRET_KEY);
    }

    async createPaymentIntent(data) {
        try {
            data.payment_method_types = ['card'];

            const paymentIntent = await this.stripe.paymentIntents.create(data);

            return paymentIntent;
        } catch (error) {
            throw error;
        }
    }

    async confirmPaymentIntent(paymentIntentId) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId);

            console.log('Pago confirmado exitosamente:', paymentIntent);

            return paymentIntent;
        } catch (error) {
            console.error('Error al confirmar el pago:', error);
            throw error;
        }
    }
}

module.exports = PaymentService;