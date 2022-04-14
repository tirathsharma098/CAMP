const express = require('express');
const { session } = require('passport/lib');
const volunteer = require('../model/volunteer');
const router = express.Router();
const Volunteer = require('../model/volunteer');

router.get('/', async (req, res) => {
    let volunteer;
    if(req.user && !req.user.isAdmin){
        try{
        volunteer = await Volunteer.findById(req.user._id).populate('assignment');
        }catch(e){
            delete req.user;
            return redirect('/');
        }
    }
    res.render('home.ejs', {volunteer});
})

module.exports = router;