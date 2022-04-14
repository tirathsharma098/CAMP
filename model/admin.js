const mongoose = require('mongoose');
const {Schema, model} = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const adminSchema = Schema({
    fullname : {
        type : String,
        required : true
    },
    isAdmin : {
        type : Boolean,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true
    }
})

adminSchema.plugin(passportLocalMongoose);

module.exports = model('Admin', adminSchema);