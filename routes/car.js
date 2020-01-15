// Routes to protected car pages -> crud
const express = require('express');
const router  = express.Router();

/*  */
router.get('/', (req, res, next) => {
  res.render('');
});

module.exports = router;