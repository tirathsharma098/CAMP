const mongoose = require('mongoose');
const Volunteer = require('./model/volunteer');

// Connecting to DB here
main().catch(err => console.log(err, 'Mongoose Error Occured While connecting'));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/assigntask');
  console.log('Connected to DB Successfully');
}

const assignTask = async() => {
    const doc = await Volunteer.findById('62569bb1d7b4dc7de0d90bfb');
    doc.assignment.push('62567fa03460682ddd020127');
    doc.assignment.push('6256818ffd349f9c258431d8');
    await doc.save();
    console.log('assigned successfully');
}

assignTask();