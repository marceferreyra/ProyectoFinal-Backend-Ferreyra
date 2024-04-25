const authorize = (req, res, next) => {    
    const userRole = req.session.user.role;

    if (userRole === 'admin') {
        if (req.originalUrl.startsWith('/realtimeproducts')) {
            return next();
        } else {
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

    return res.status(403).json({ error: 'Acceso prohibido' });
};

module.exports = authorize;