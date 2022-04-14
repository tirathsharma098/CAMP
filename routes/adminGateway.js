const express = require('express');
const router = express.Router();
const passport = require('passport');
const {authPerson} = require('../middlewares')

router.get('/login', (req, res) => {
    res.render('admin/login');
})

router.post('/login', passport.authenticate('admin-login', {failureFlash:true, failureRedirect: 'login'}) ,(req, res) => {
    req.flash('success', 'Admin Loged In Successfully');
    res.redirect('/');
})

router.get('/logout', authPerson, (req, res) => {
    req.logout();
    req.flash('success', 'Logged Out Successfully');
    res.redirect('/');
})

module.exports = router;