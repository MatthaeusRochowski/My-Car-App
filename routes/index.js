const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  const loggedIn = req.session.user;
  res.render('index', {user: loggedIn});
});

router.get('/main', (req,res) => {
  const loggedUser = req.session.user;
  res.render('auth/home-main', {user: loggedUser});
});

const loginCheck = () => {
  return (req, res, next) => 
    (req.session.user ? next () : res.redirect('/'));
};

router.get('/home', loginCheck(), (req, res) => {
  const loggedUser = req.session.user;
  res.render('auth/home-private', { user: loggedUser});
});

module.exports = router;
