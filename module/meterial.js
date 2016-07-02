var Q = require('q');
var db = require('../lib/order_db');

var meterial = function(){

};

meterial.prototype.initmeterial = function initmeterial(){
  var mtr = {mid: 'm10001', count: 500};
  this.savemeterial(mtr);
  mtr.mid = 'm10002';
  mtr.count = 400;
  this.savemeterial(mtr);
};

meterial.prototype.savemeterial = function savemeterial(meterial){
  var mt = {};
  mt.mid = meterial.mid;
  mt.count = meterial.count;
  // console.log('meterial savemeterial');
  // console.log(meterial);
  return db.savemeterial(mt);
};

meterial.prototype.getmeterial = function getmeterial(meterialid){
  return db.getmeterial(meterialid)
    .then(function(data){
      // console.log('meterial getmeterial');
      var mt = {};
      mt.mid = meterialid;
      mt.count = Number(data);
      // console.log(mt);
      return mt;
    });
};

meterial.prototype.getallmeterial = function getallmeterial(){
  var meterials = [];
  return db.getallmeterial()
    .then(function(data){
      data = JSON.stringify(data);
      data = data.replace(/\\\"/g, "\"").replace(/\"{/g, "{").replace(/}\"/g, "}");
      // console.log(data);
      data = JSON.parse(data);
      for(i in data)
      {
        // console.log(i);
        data[i] = data[i] >> 0;
        var mtr = {};
        mtr.mid = i;
        mtr.count = data[i];
        meterials.push(mtr);
      }
      return meterials;
    });

};

meterial.prototype.inputmeterial = function inputmeterial(meterial){
  var mt_obj = this;
  console.log(meterial);
  this.getmeterial(meterial.mid.toString())
    .then(function(mt){
      // console.log(mt);
      if(mt)
      {
        mt.count += meterial.count;
        // console.log(mt);
        // console.log('save mt to redis');
        return mt_obj.savemeterial(mt);
      }else
      {
        // console.log('mt not found');
        // console.log(meterial);
        return mt_obj.savemeterial(meterial);
      }
    });
};

meterial.prototype.outputmeterial = function outputmeterial(){
  var mt_obj = this;
  this.getmeterial(meterial.mid.toString())
    .then(function(mt){
      // console.log(mt);
      if(mt)
      {
        mt.count -= meterial.count;
        // console.log(mt);
        // console.log('save mt to redis');
        return mt_obj.savemeterial(mt);
      }else
      {
        // console.log('mt not found');
        // console.log(meterial);
        // return mt_obj.savemeterial(meterial);
        return null;
      }
    });
};

module.exports = meterial;
module.exports.meterial = meterial;
