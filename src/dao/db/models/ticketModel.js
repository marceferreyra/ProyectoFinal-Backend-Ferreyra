const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true 
    }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;