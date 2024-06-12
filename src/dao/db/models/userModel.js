const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const documentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    reference: { type: String, required: true }, 
    status: { type: String, enum: ['pendiente', 'completado'], default: 'pendiente' }
});

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: function () {
            return !this.github;
        }
    },
    last_name: {
        type: String,
        required: function () {
            return !this.github; 
        }
    },
    email: {
        type: String,
        required: true, 
        unique: true,
    },
    age: {
        type: Number,
        required: function () {
            return !this.github; 
        }
    },
    password: {
        type: String,
        required: function () {
            return !this.github;
        }
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'premium'],
        default: 'user'
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    documents: [documentSchema],
    last_connection: {
        type: Date
    }
}, {
    timestamps: true,
    strict: false
});

userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
