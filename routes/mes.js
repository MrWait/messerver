var express = require('express');
var handler = require('../lib/mes_handler');

var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/inputmeterial', handler.inputmeterial);
router.get('/inputmeterial', handler.initmeterial);
router.get('/getallorder', handler.getallorder);
router.get('/getallmeterial', handler.getallmeterial);
router.get('/initorder', handler.initorder);
router.post('/inputmeterialid', handler.inputmeterialid);
router.get('/getallmeterial_online', handler.getallmeterial_online);
router.get('/initmeterial', handler.initmeterial);


module.exports = router;
