const express = require('express');
const sessionRouter = express.Router();
const sessionController = require('../dao/db/controllers/sessionController');
const passport = require('passport');


sessionRouter.get('/github', passport.authenticate("githubAuth", {}));
sessionRouter.get('/callbackGithub', passport.authenticate("githubAuth", {}), sessionController.githubAuthCallback);


sessionRouter.post('/register', sessionController.register);
sessionRouter.post('/login', sessionController.login);
sessionRouter.post('/logout', sessionController.logout);
sessionRouter.get('/current', sessionController.getCurrent);
sessionRouter.get('/profile', sessionController.isAuthenticated, sessionController.getProfile);

sessionRouter.post('/forgot-password', sessionController.sendPasswordResetEmail);
sessionRouter.post('/reset-password', sessionController.resetPassword);


module.exports = sessionRouter;
