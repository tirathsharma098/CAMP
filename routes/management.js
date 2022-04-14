const express = require('express');
const router = express.Router();
const Task = require('../model/task');
const Volunteer = require('../model/volunteer')
const {authPerson, checkAdmin} = require('../middlewares.js');

// Authenticated and Authorized here if Admin is logged In
router.use(authPerson, checkAdmin);

router.get('/', async (req, res) => {
    const tasks = await Task.find({}).populate('creator');
    const assignTaskId = req.session.assignTaskId;
    delete req.session.assignTaskId;
    res.render('task/show.ejs', {tasks, assignTaskId});
})

router.get('/new', (req, res) => {
    res.render('task/new.ejs');
})

router.post('/', async(req, res) => {
    const {title, description} = req.body;
    const task = new Task({title: title, description: description});
    task.creator = req.user._id;
    await task.save();
    req.flash('success', 'Task Added Successfully.');
    res.redirect('/');
})

router.delete('/', async(req, res) => {
    const {id} = req.body;
    const taskExist = await Task.findById(id);
    if(!taskExist || !taskExist.creator.equals(req.user._id) ){
        req.flash('error', 'Something Went Wrong');
        return res.redirect('task');
    }

    const volunteer = await Volunteer.find({assignment : id});
    if(volunteer.length){
        taskExist.title = 'Deleted';
        taskExist.description = 'Deleted';
        await taskExist.save();
        req.flash('success', 'Task Deleted Successfully. To fully delete first remove same task from all Volunteers');
        return res.redirect('task');
    }

    const deletedTask = await Task.deleteOne(taskExist);
    if(deletedTask){
        req.flash('success', 'Task Deleted Successfully');
        return res.redirect('task');
    }
    req.flash('error','Something Went Wrong!');
    res.redirect('task');
})

module.exports = router;