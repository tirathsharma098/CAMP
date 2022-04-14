const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const Admin = require('./model/admin');
const Volunteer = require('./model/volunteer');
const AppError = require('./utilities/AppError');
const flash = require('connect-flash');
const methodOverride = require('method-override');

// Importing all ROUTES
const homeRoute = require('./routes/homeRoute.js');
const managementRoute = require('./routes/management.js');
const adminRoute = require('./routes/adminGateway');
const volunteerRoute = require('./routes/volunteer');

// Connecting to DB here
main().catch(err => console.log(err, 'Mongoose Error Occured While connecting'));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/assigntask');
  console.log('Connected to DB Successfully');
}

// Session configuration should be in config file
const sessionConfig = {
  secret : 'createdbytirathsharma',
  resave : false,
  saveUninitialized : true,
  cookie : {
    httpOnly : true,
    maxAge : 1000 * 60 * 60* 24 * 15,
    signed : true
  }
}

// All Middlewares comes here
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.engine('ejs', ejsMate);
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, './public')));
app.use(session(sessionConfig));
app.use(flash());

// PASSPORT middlewares
app.use(passport.initialize());
app.use(passport.session());
passport.use('admin-login', new LocalStrategy( Admin.authenticate() ));
passport.use('volunteer-login', new LocalStrategy( Volunteer.authenticate() ));
passport.serializeUser((user, done) => { 
  if(user.isAdmin){
    done(null, {fullname : user.fullname, _id:user._id, isAdmin : user.isAdmin, username : user.username });
  }else{
    done(null, {fullname : user.fullname, _id: user._id, username : user.username, email: user.email, address : user.address, skills : user.skills, qualifications: user.qualifications });
  }
});
passport.deserializeUser((user, done) => {
  if(user!=null)
    done(null,user);
});

// Creating Locals Variables here
app.use((req, res, next) => {
  res.locals.currentPerson = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
})

// All Routes Declarations
app.use('/', homeRoute);
app.use('/admin', adminRoute);
app.use('/admin/task', managementRoute);
app.use('/volunteer', volunteerRoute);

app.all('*' , (req, res, next) => {
  throw new AppError('OHhh O! Page Not Found Which you are looking for.', 404);
})

app.use((err, req, res, next) => {
  const {status=400, message= 'Something Went Wrong!'} = err;
  res.status(status).render('error.ejs', {message});
})

app.listen(3000, ()=>{
    console.log('Listining to port 3000');
})