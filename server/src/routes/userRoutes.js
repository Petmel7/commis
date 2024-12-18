
const express = require('express');
const passport = require('../config/passport');
const { generateAccessToken, generateRefreshToken } = require('../auth/auth');
const { RefreshToken } = require('../models');
const { updateUserLoginStatus } = require('../utils/userUtils');
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), async (req, res) => {
    req.login(req.user, async (err) => {
        if (err) {
            return res.status(500).json({ message: 'Login error' });
        }
        try {
            const user = req.user;
            await updateUserLoginStatus(user);

            const accessToken = generateAccessToken(req.user.id);
            const refreshToken = generateRefreshToken(req.user.id);

            // Збереження refresh token у базі даних
            await RefreshToken.create({ user_id: req.user.id, token: refreshToken });

            res.redirect(`http://localhost:3000/auth/callback?token=${accessToken}&refreshToken=${refreshToken}`);
        } catch (error) {
            console.error('Error during Google authentication:', error);
            res.status(500).json({ message: 'Failed to authenticate with Google' });
        }
    });
});

module.exports = router;







