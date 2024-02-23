const express = require('express');
const cookiesRouter = express.Router();


cookiesRouter.get('/', async (req, res) => {
    try {
          res.render('cookies');          
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener productos desde MongoDB.' });
    }
});

module.exports = cookiesRouter;