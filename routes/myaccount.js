// Routes to protected car pages -> crud
const express = require('express');
const router  = express.Router();

/*  */
const loginCheck = () => {
  return (req, res, next) => 
    (req.session.user ? next () : res.redirect('/'));
};

router.get('/myaccount', loginCheck(), (req, res) => {
  const loggedUser = req.session.user;
  res.render('auth/myaccount', { user: loggedUser});
});

router.get('/home-main', loginCheck(), (req,res) => {
  const loggedUser = req.session.user;
  res.render('auth/home-main', {user: loggedUser});
});



module.exports = router;