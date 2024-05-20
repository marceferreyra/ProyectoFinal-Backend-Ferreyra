const User = require('../models/userModel');

exports.renderPremiumPage = async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await User.findById(userId).lean({ getters: true });
        
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        res.render('premium-user', { user });
    } catch (error) {
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

        user.role = newRole;

        await user.save();


        console.log('Rol del usuario actualizado correctamente a:', newRole); 
        res.status(200).json({ message: 'Rol de usuario actualizado exitosamente', role: newRole });
    } catch (error) {
        console.error('Error al cambiar el rol del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};







