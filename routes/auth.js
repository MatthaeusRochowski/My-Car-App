// Signup, Login, Logout routes
const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");

/****** signup ********************************/

router.post('/signup', (req, res, next) => {
  console.log('inside signup ')
  const {email, password, username} = req.body;
  //const email = req.body.email;
  //const password = req.body.password; 
  //const username = req.body.username;
  const passwordLength = 10;


  if (!email)
    return res.render("index", {message: "E-Mail-Adresse muss befüllt sein"});

  if (!password)
    return res.render("index", {message: "Passwort muss befüllt sein"});
  
  if (!username)
    return res.render("index", {message: "Nutzername muss befüllt sein"});
  
  if (password.length < passwordLength)
    return res.render("index", {message: `Passwortlänge darf nicht weniger als ${passwordLength} Zeichen sein`});
  

User.findOne({username})
  .then(foundUser => {
    if (foundUser)
      return res.render("index", {
        message: `Nutzername ${foundUser.username} wird bereits verwendet`
      });
    
    bcrypt
    .genSalt()
    .then(salt => bcrypt.hash(password, salt))
    .then(hash => User.create({email: email, password: hash, username: username}))
    .then(newUser => {
      req.session.user = newUser;
      res.redirect("/");
    });
  })
  .catch(err => next(err));
});


/****** login ********************************/

router.post('/login', (req, res, next) => {
  const {email, password} = req.body;
  User.findOne({email})
  .then(foundUser => {
    if (!foundUser)
      return res.render('/', {errorMessage: "E-Mail-Adresse existiert nicht"});
  
      bcrypt.compare(password, foundUser.password)
      .then(exist => {
        if (!exist)
          return res.render('/', {errorMessage: "Passwort ist falsch"});
      
      req.session.user = foundUser;
      res.render('auth/home-main');
      });
  })
  .catch(err => next (err));
});


/****** logout ********************************/

router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      next(err);
    }else {
      res.clearCookie("connect.sid");
      res.redirect('/');
    }
  });
});


module.exports = router;