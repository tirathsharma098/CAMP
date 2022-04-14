const mongoose = require('mongoose');
const {Schema, model} = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const volunteerSchema = Schema({
    fullname : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    address : {
        type : String,
    },
    skills : {
        type : String,
    },
    qualifications : String,
    addedBy : {
        type : Schema.Types.ObjectId,
        ref : 'Admin' 
    },
    assignment : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Task'
        }
    ]    
})

volunteerSchema.plugin(passportLocalMongoose);

module.exports = model('Volunteer', volunteerSchema);