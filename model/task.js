const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const taskSchema = Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    creator : {
        type : Schema.Types.ObjectId,
        ref : 'Admin'
    }
})

module.exports = model('Task', taskSchema);