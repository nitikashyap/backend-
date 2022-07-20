var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("indexRoute====>")
  res.json({ title: 'hunting App' });
});

module.exports = router;
