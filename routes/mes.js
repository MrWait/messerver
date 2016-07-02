var express = require('express');
var handler = require('../lib/mes_handler');

var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/inputmeterial', handler.inputmeterial);
router.get('/initmeterial', handler.initmeterial);
router.get('/getallmeterial', handler.getallmeterial);

router.get('/getallmeterial_produce', handler.getallmeterial_produce);
router.get('/initmeterial_produce', handler.initmeterial_produce);

router.post('/inputmeterialid', handler.inputmeterialid);

router.get('/initorder', handler.initorder);
router.get('/getallorder', handler.getallorder);

router.post('/meterial/input', handler.inputmeterial);
router.get('/meterial/init', handler.initmeterial);
router.get('/meterial/getall', handler.getallmeterial);

router.get('/meterial_produce/getall', handler.getallmeterial_produce);
router.get('/meterial_produce/init', handler.initmeterial_produce);
router.post('/meterial_produce/input', handler.inputmeterial_produce);

router.post('/inputmeterialid', handler.inputmeterialid);

router.get('/order/init', handler.initorder);
router.get('/order/getall', handler.getallorder);
router.get('/order/update', handler.updateorder);

module.exports = router;
