var md5 = require('MD5');
// Authenticate user
exports.authenticate = function (db, secret, jwt) {
  return function (req, res) {
    findLogin(db, req, function (usr) {
      if (usr) {
        var token = jwt.sign(usr, secret, { expiresInMinutes: 60 * 5 });
        res.json({ token: token });
      } else {
        res.send(401, 'Wrong user or password');
      }
    });
  };
};
// Registration page
exports.signup = function (db, mail) {
  return function (req, res) {
    var usr, users, token;
    req.assert('nombre', 'required').notEmpty();
    req.assert('apellido', 'required').notEmpty();
    req.assert('email', 'required').notEmpty();
    req.assert('email', 'valid email required').isEmail();
    req.assert('password', '4 to 20 characters required').len(4, 20);
    if (errors = req.validationErrors()) {
      res.json({
        err: 'ERR_INVALID_PARAMETERS',
        errors: errors
      }, 500);
      return;
    }
    checkUser(db, req.body.email, function (exist_usr) {
      if (exist_usr) {
        res.json({ err: 'ERR_USR_EMAIL_EXISTENTE' }, 500);
        return;
      }
      usr = {
        email: req.body.email,
        password: md5(req.body.password),
        active: 0,
        profile: new profile(req)
      };
      var users = db.get('users');
      users.insert(usr, function (err, doc) {
        if (err) {
          res.json({ err: err });
        } else {
          token = mail.sendConfirmateMail(usr.email);
          users.update({
            email: usr.email,
            name: usr.name
          }, { $set: { confirmToken: token } });
          res.json({ res: 'OP_OK' });
        }
      });
    });
  };
};
//db.get('users').update({ email: req.user.email}, { $push : { reclamos: ob}});
//db.get('users').update({ email: req.user.email, "reclamos.codigo": req.body.codigo}, { $set:{ "reclamos.$.active": 0}});
exports.update = function (db) {
  return function (req, res) {
    var usr, users, token;
    req.assert('nombre', 'required').notEmpty();
    req.assert('apellido', 'required').notEmpty();
    /*    req.assert('direccion', 'required').notEmpty();
    req.assert('telefono', 'required').notEmpty();
    req.assert('matricula', 'required').notEmpty();
    req.assert('nacimiento', 'required').notEmpty();
    */
    if (errors = req.validationErrors()) {
      res.json({
        err: 'ERR_INVALID_PARAMETERS',
        errors: errors
      }, 500);
      return;
    }
    usr = new profile(req);
    db.get('users').update({ email: req.user.email }, { $set: { profile: usr } });
    res.json({ res: 'OP_OK' });
  };
};
exports.profile = function (db) {
  return function (req, res) {
    db.get('users').findOne({ email: req.user.email }, function (err, obj) {
      if (obj.profile) {
        obj.profile.email = req.user.email;
      }
      res.json(obj.profile);
    }).profile;
  };
};
exports.confirmEmail = function (db) {
  return function (req, res) {
    req.checkParams('token', 'required').notEmpty();
    req.checkParams('token', 'invalid').len(15, 200);
    var errors = req.validationErrors();
    if (errors) {
      res.json({
        err: 'Invalid parameters',
        errors: errors
      }, 500);
      return;
    }
    var users = db.get('users');
    users.update({ confirmToken: req.param('token') }, {
      $set: {
        active: 1,
        confirmToken: null
      }
    });
    res.json({ res: 'OP_OK' });
  };
};
exports.find = function (db, name, email) {
  return function (req, res) {
    db.get('users').findOne({
      name: req.params.name,
      email: req.params.email
    }).on('success', function (usr) {
      return res.json(usr);
    });
  };
};
exports.findLogin = findLogin;
function checkUser(db, email, callback) {
  db.get('users').findOne({ email: email }).on('success', function (usr) {
    if (usr) {
      callback(usr);
    } else {
      callback(false);
    }
  });
}
function findLogin(db, req, callback) {
  req.assert('email', 'required').notEmpty();
  req.assert('password', 'required').notEmpty();
  if (req.validationErrors()) {
    callback(false);
    return;
  }
  db.get('users').findOne({
    active: 1,
    email: req.body.email,
    password: md5(req.body.password)
  }, {
    id: 1,
    email: 1
  }).on('success', function (usr) {
    if (usr) {
      callback(usr);
    } else {
      callback(false);
    }
  });
}
function profile(req) {
  this.nombre = req.body.nombre;
  this.apellido = req.body.apellido;
  this.direccion = req.body.direccion;
  this.telefono = req.body.telefono;
  this.nacimiento = req.body.nacimiento;
}  // Get password reset page
   //exports.password_reset = function(req, res, next){
   //}
   // Verify passport reset and update password
   //exports.process_password_reset = function(req, res, next){
   //User.findOne({username:req.body.username}, function(err, user){
   //if(err) return next(err);
   //if(!user){
   //req.flash('error', "Password reset token invalid.");
   //return res.redirect("/");
   //}
   //var tokenExpiration =  6 // time in hours
   //if(req.body.token == user.resetPasswordToken && Date.now() < (user.resetPasswordTokenCreatedAt.getTime() + tokenExpiration * 3600000)){
   //// Token approved, on to new password validations
   //req.assert('password', 'Your password must be 6 to 20 characters long.').len(6, 20);
   //var validationErrors = req.validationErrors() || [];
   //if (req.body.password != req.body.passwordConfirmation) validationErrors.push({msg:"Password and password confirmation did not match."});
   //if (validationErrors.length > 0){
   //validationErrors.forEach(function(e){
   //req.flash('error', e.msg);
   //});
   //return res.render('users/password_reset', {errorMessages: req.flash('error'), token : req.body.token, username : req.body.username});
   //}
   //// Passed new password validations, updating password
   //user.set(req.body);
   //user.save(function(err, user){
   //if(err) return next(err);
   //// Password updated successfully, logging In
   //req.login(user, function(err) {
   //if (err) { return next(err); }
   //req.flash('success', "Password updated successfully, you are now logged in.");
   //return res.redirect('/dashboard');
   //});
   //});
   //} else {
   //req.flash('error', "Password reset token has expired.");
   //return res.redirect("/");
   //}
   //});
   //}
   // Update user
   //exports.update2 = function(req, res, next){
   //var user = req.user;
   //// remove password attribute from form if not changing
   //if (!req.body.password) delete req.body.password;
   //// ensure valid current password
   //user.validPassword(req.body.currentPassword, function(err, isMatch){
   //if(err) return next(err);
   //if(isMatch) return updateUser();
   //else return failedPasswordConfirmation();
   //});
   //// Handle correct current password and changes to user
   //function updateUser(){
   //// use save instead of update to trigger 'save' event for password hashing
   //user.set(req.body);
   //user.save(function(err, user){
   //// Uniqueness and Save Validations
   //if (err && err.code == 11001){
   //var duplicatedAttribute = err.err.split("$")[1].split("_")[0];
   //req.flash('error', "That " + duplicatedAttribute + " is already in use.");
   //return res.redirect('/account');
   //}
   //if(err) return next(err);
   //// User updated successfully, redirecting
   //req.flash('success', "Account updated successfully.");
   //return res.redirect('/account');
   //});
   //}
   //// Handle incorrect current password entry
   //function failedPasswordConfirmation(){
   //req.flash('error', "Incorrect current password.");
   //return res.redirect("/account");
   //}
   //}
   // Create user
   //exports.create = function(req, res, next){
   //var newUser = new User(req.body);
   //newUser.save(function(err, user){
   //// Uniqueness and save validations
   //if (err && err.code == 11000){
   //var duplicatedAttribute = err.err.split("$")[1].split("_")[0];
   //req.flash('error', "That " + duplicatedAttribute + " is already in use.");
   //return res.render('users/new', {user : newUser, errorMessages: req.flash('error')});
   //}
   //if(err) return next(err);
   //// New user created successfully, logging In
   //req.login(user, function(err) {
   //if (err) { return next(err); }
   //req.flash('success', "Account created successfully!");
   //return res.redirect('/dashboard');
   //});
   //});
   //}
   // Get password reset request
   //exports.reset_password = function(req, res){
   //res.render('users/reset_password');
   //}
   // Log user out and redirect to home page
   //exports.logout = function(req, res){
   ////req.logout();
   //res.json({ res: 'OP_OK'});
   //}
   // Account page
   //exports.account = function(req,res){
   //res.render('users/edit');
   //}
   // Get login page
   //exports.login = function(req, res){
   //res.render('users/login', { postAuthDestination : req.query.postAuthDestination || "" });
   //}
   // Get dashboard
   //exports.dashboard = function(req, res){
   //res.render('users/dashboard');
   //}
   //exports.generate_password_reset = function(req, res, next){
   //// Validations
   //req.assert('email', 'You must provide an email address.').notEmpty();
   //req.assert('email', 'Your email address must be valid.').isEmail();
   //var validationErrors = req.validationErrors() || [];
   //if (validationErrors.length > 0){
   //validationErrors.forEach(function(e){
   //req.flash('error', e.msg);
   //});
   //return res.redirect("/reset_password");
   //}
   //// Passed validations
   //User.findOne({email:req.body.email}, function(err, user){
   //if(err) return next(err);
   //if(!user){
   //// Mimic real behavior if someone is attempting to guess passwords
   //req.flash('success', "You will receive a link to reset your password at "+req.body.email+".");
   //return res.redirect('/');
   //}
   //user.generatePerishableToken(function(err,token){
   //if(err) return next(err);
   //// Generated reset token, saving to user
   //user.update({
   //resetPasswordToken : token,
   //resetPasswordTokenCreatedAt : Date.now()
   //}, function(err){
   //if(err) return next(err);
   //// Saved token to user, sending email instructions
   //res.mailer.send('mailer/password_reset', {
   //to: user.email,
   //subject: 'Password Reset Request',
   //username: user.username,
   //token: token,
   //urlBase: "http://"+req.headers.host+"/password_reset"
   //}, function(err) {
   //if(err) return next(err);
   //// Sent email instructions, alerting user
   //req.flash('success', "You will receive a link to reset your password at "+req.body.email+".");
   //res.redirect('/');
   //});
   //});
   //});
   //});
   //}
