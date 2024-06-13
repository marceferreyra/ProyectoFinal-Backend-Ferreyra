const mongoose = require('mongoose');
const User = require('../models/userModel');

exports.renderPremiumPage = async (req, res) => {
    try {
        const userId = req.params.uid;
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send('El ID de usuario no es válido');
        }

        const user = await User.findById(userId).lean();

        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
        const userDocuments = user.documents.map(doc => doc.name);
        const allDocumentsPresent = requiredDocuments.every(doc => userDocuments.includes(doc));

        if (!allDocumentsPresent) {
            return res.status(403).json({ error: 'El usuario no ha terminado de procesar su documentación'});
        }

        res.render('premium-user', { user });

    } catch (error) {
        console.error('Error al renderizar la página premium:', error);
        res.status(500).send('Error interno del servidor');
    }
};

exports.togglePremium = async (req, res) => {
    try {
        console.log('Iniciando proceso para cambiar el rol del usuario...');

        const userId = req.params.uid;
        const newRole = req.body.role;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (newRole === 'premium' && user.role !== 'premium') {
            const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
            const userDocuments = user.documents.filter(doc => doc.status === 'completado').map(doc => doc.name);

            const allDocumentsPresent = requiredDocuments.every(doc => userDocuments.includes(doc));

            if (!allDocumentsPresent) {
                return res.status(400).json({ error: 'El usuario no ha terminado de procesar su documentación' });
            }
        }

        user.role = newRole;

        await user.save();

        console.log('Rol del usuario actualizado correctamente a:', newRole);
        res.status(200).json({ message: 'Rol de usuario actualizado exitosamente', role: newRole });
    } catch (error) {
        console.error('Error al cambiar el rol del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};



exports.uploadDocuments = async (req, res) => {
    try {
        const userId = req.params.uid;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'El ID de usuario no es válido' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (req.files['profile']) {
            const profile = req.files['profile'][0];
            user.documents.push({ name: 'profile', reference: profile.path, status: 'completado' });
        }
        
        if (req.files['product']) {
            const product = req.files['product'][0];
            user.documents.push({ name: 'product', reference: product.path, status: 'completado' });
        }

        if (req.files['identificacion']) {
            const identificacion = req.files['identificacion'][0];
            user.documents.push({ name: 'Identificación', reference: identificacion.path, status: 'completado' });
        }
        
        if (req.files['comprobante_domicilio']) {
            const comprobanteDomicilio = req.files['comprobante_domicilio'][0];
            user.documents.push({ name: 'Comprobante de domicilio', reference: comprobanteDomicilio.path, status: 'completado' });
        }
        
        if (req.files['comprobante_estado_cuenta']) {
            const comprobanteEstadoCuenta = req.files['comprobante_estado_cuenta'][0];
            user.documents.push({ name: 'Comprobante de estado de cuenta', reference: comprobanteEstadoCuenta.path, status: 'completado' });
        }

        await user.save();
        res.status(200).json({ message: 'Documentos subidos exitosamente' });
    } catch (error) {
        console.error('Error al subir documentos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};



exports.renderPremiumDocumentsPage = async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await User.findById(userId).lean({ getters: true });

        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        res.render('premium-user-documents', { user });
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }
};






