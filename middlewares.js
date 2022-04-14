
exports.authPerson = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.flash('error', 'You Should Logged In first');
        return res.redirect('/');
    }
    next();
}

exports.checkAdmin = (req, res, next) => {
    if(!req.user.isAdmin){
        req.flash('error', 'Something Went Wrong!');
        return res.redirect('/');
    }
    next();
}