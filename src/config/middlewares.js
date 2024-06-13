const User = require('../dao/db/models/userModel')

const authorize = async (req, res, next) => {
    try {
        if (!req.session || !req.session.user || !req.session.user.role) {
            return res.status(403).json({ error: 'Acceso prohibido' });
        }

        const userId = req.session.user._id;
        const user = await User.findById(userId);

        if (!user || !user.role) {
            return res.status(403).json({ error: 'Acceso prohibido' });
        }

        const userRole = user.role;

        if (userRole === 'admin') {
            if (req.originalUrl.startsWith('/realtimeproducts') ||
                req.originalUrl.startsWith('/api/carts')
            ) {
                console.log('Acceso permitido para administrador a realtimeproducts');
                return next();
            } else {
                console.log('Acceso prohibido para administrador');
                return res.status(403).json({ error: 'Acceso prohibido' });
            }
        }

        if (userRole === 'user') {
            if (req.originalUrl.startsWith('/api/carts') ||
                req.originalUrl.startsWith('/chat') ||
                req.originalUrl.startsWith('/products')) {
                return next();
            } else {
                return res.status(403).json({ error: 'Acceso prohibido' });
            }
        }

        if (userRole === 'premium') {
            if (req.originalUrl.startsWith('/realtimeproducts') ||
                req.originalUrl.startsWith('/api/carts') ||
                req.originalUrl.startsWith('/chat') ||
                req.originalUrl.startsWith('/products')) {
                return next();
            } else {
                return res.status(403).json({ error: 'Acceso prohibido' });
            }
        }

        return res.status(403).json({ error: 'Acceso prohibido' });
    } catch (error) {
        console.error('Error al verificar autorización:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = authorize;