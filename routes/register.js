const express = require('express')

const router = express.Router();


/* GET register */
router.get('/', function(req, res, next) {
  res.render('registro');
});


module.exports = router;