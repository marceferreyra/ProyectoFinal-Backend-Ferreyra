const SessionService = require('../services/sessionService');
const sessionService = new SessionService();

exports.isAuthenticated = async (req, res, next) => {
    try {
        const isAuthenticated = await sessionService.isAuthenticated(req);
        if (isAuthenticated) {
            next();
        } else {
            res.status(401).json({ message: 'No autenticado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.githubAuthCallback = async (req, res) => {
    try {
        await sessionService.githubAuthCallback(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.register = async (req, res) => {
    try {
        await sessionService.register(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.login = async (req, res) => {
    try {
        if (req.session.user) {
            return res.status(400).json({ error: 'Ya has iniciado sesión' });
        }

        const { email, password } = req.body;

        const { error, user } = await sessionService.login(email, password);

        if (error) {
            return res.status(401).json({ error });
        }

        req.session.user = user;
        res.status(200).json({ message: 'Inicio de sesión exitoso', email: user.email, role: user.role });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.logout = async (req, res) => {
    try {
        await sessionService.logout(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.getCurrent = async (req, res) => {
    try {
        await sessionService.getCurrent(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        await sessionService.getProfile(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.sendPasswordResetEmail = async (req, res) => {
    try {
        await sessionService.sendPasswordResetEmail(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        await sessionService.resetPassword(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};



