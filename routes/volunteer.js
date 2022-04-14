const express = require('express');
const router = express.Router();
const {checkAdmin, authPerson} = require('../middlewares');
const Volunteer = require('../model/volunteer');
const Task =  require('../model/task')
const passport = require('passport');


router.get('/register',authPerson, checkAdmin, (req, res) => {
    res.render('volunteer/register.ejs');
})

router.post('/register', authPerson, checkAdmin, async(req, res) => {
    const {fullname, email, address, skills, qualifications, password, username} = req.body;
    let user = new Volunteer({fullname: fullname, email:email, address:address, skills: skills, qualifications: qualifications, username: username});
    if(!user){
        req.flash('error', 'Something Went Wrong');
        return res.redirect('/');
    }
    user.addedBy = req.user._id;
    try{
        user = await Volunteer.register(user, password);
        req.flash('success', 'Volunteer Added Successfully');
        return res.redirect('/');
    }catch (err){
        req.flash('error', 'Something Went Wrong');
        return res.redirect('/');
    }
})

router.get('/login', (req, res) => {
    res.render('volunteer/login.ejs');
})

router.post('/login', passport.authenticate('volunteer-login', {failureFlash: true, failureRedirect: 'register'}), (req, res) => {
    req.flash('success', 'Volunteer Logged In Successfully');
    return res.redirect('/');
})

router.get('/logout', authPerson, (req, res) => {
    req.logout();
    req.flash('success', 'Logged Out Successfully');
    res.redirect('/');
})

// Displaying All Volunteers Available
router.get('/show', authPerson, checkAdmin, async (req, res) => {
    const allVolunteer = await Volunteer.find({}).populate('addedBy assignment');
    if(!allVolunteer){
        req.flash('error', 'Something Went Wrong');
        return res.redirect('/');
    }
    res.render('volunteer/show.ejs', {allVolunteer});
})

router.post('/assign', authPerson, checkAdmin, async(req, res) => {
    delete req.session.assignTaskId;
    const {id} = req.body;
    const doc = await Volunteer.findById(id);
    if(!doc){
        req.flash('error', 'Something Went Wrong');
        return res.redirect('/');
    }
    req.session.assignTaskId = id;
    res.redirect('/admin/task');
})

router.put('/assign', authPerson, checkAdmin, async(req, res) => {
    const {assignTaskId, taskId} = req.body;
    const user = await Volunteer.findById(assignTaskId);
    const task = await Task.findById(taskId);
    if(!user || !task){
        req.flash('error', 'Something Went Wrong');
        return res.redirect('/');
    }else{
        for(let element of user.assignment){
            if(element.equals(taskId)){
                req.flash('error', 'Volunteer Already have Same Task Assigned');
                return res.redirect('show');
            }
        }
    }
    user.assignment.push(task);
    await user.save();
    req.flash('success', 'Task Assign to Volunteer Successfully');
    res.redirect('show');
})

router.delete('/', authPerson, checkAdmin, async(req, res) => {
    const {id} = req.body;
    const volunteer = await Volunteer.findById(id);
    if(!volunteer || !volunteer.addedBy.equals(req.user._id)){
        req.flash('error', 'Something went wrong!');
        return res.redirect('/volunteer/show');
    }
    const deletedVol = await Volunteer.findByIdAndDelete(id);
    if(deletedVol){
        req.flash('success', 'Volunteer Deleted Successfully');
        return res.redirect('/volunteer/show');
    }
    req.flash('error', 'Something Went Wrong');
    res.redirect('/volunteer/show');
})

module.exports = router;