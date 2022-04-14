const Admin = require('./model/admin');
const mongoose = require('mongoose');

// Connecting to DB here
main().catch(err => console.log(err, 'Mongoose Error Occured While connecting'));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/assigntask');
  console.log('Connected to DB Successfully');
}

let previousPass = ['kit', 'sit', 'tim']

const adminDetails = {
    fullname : 'tim',
    isAdmin : true,
    email : 'tim@gmail.com',
    username : 'tim'
}

const addAdmin = async() => {
    const doc = new Admin(adminDetails);
    try{
        const registeredAdmin = await Admin.register(doc, 'tim')
        console.log('Successfully created Admin' , registeredAdmin);
    }catch(e){
        console.log('Error Occured while registering Admin');
    }
}


//addAdmin();