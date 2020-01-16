const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  const loggedIn = req.session.user;
  res.render('index', {user: loggedIn});
});

module.exports = router;
