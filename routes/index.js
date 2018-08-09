var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/nouvelle_annonce', function(req, res, next) {
  objet = req.query["objet"]
  res.send(objet)
});

module.exports = router;
