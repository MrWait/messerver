var Q = require('q');
var db = require('../lib/order_db');
var mt = require('./meterial');

var meterial_produce = function(){

};

meterial_produce.prototype.initmeterial_produce = function initmeterial_produce(){
  var mtr = {mid: 'm10001', count: 500};
  this.savemeterial_produce(mtr);
  mtr.mid = 'm10002';
  mtr.count = 400;
  this.savemeterial_produce(mtr);
};

meterial_produce.prototype.savemeterial_produce = function savemeterial_produce(meterial_produce){
  var mt = {};
  mt.mid = meterial_produce.mid;
  mt.count = meterial_produce.count;
  // console.log('meterial_produce savemeterial_produce');
  // console.log(meterial_produce);
  return db.savemeterial_produce(mt);
};

meterial_produce.prototype.getmeterial_produce = function getmeterial_produce(meterial_produceid){
  return db.getmeterial_produce(meterial_produceid)
    .then(function(data){
      // console.log('meterial_produce getmeterial_produce');
      var mt = {};
      mt.mid = meterial_produceid;
      mt.count = Number(data);
      // console.log(mt);
      return mt;
    });
};

meterial_produce.prototype.getallmeterial_produce = function getallmeterial_produce(){
  var meterial_produces = [];
  return db.getallmeterial_produce()
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
        meterial_produces.push(mtr);
      }
      return meterial_produces;
    });

};

meterial_produce.prototype.inputmeterial_produce = function inputmeterial_produce(meterial_produce){
  var mt_obj = this;
  this.getmeterial_produce(meterial_produce.mid.toString())
    .then(function(mt){
      // console.log(mt);
      if(mt)
      {
        mt.count += meterial_produce.count;
        // console.log(mt);
        // console.log('save mt to redis');
        return mt_obj.savemeterial_produce(mt);
      }else
      {
        // console.log('mt not found');
        // console.log(meterial_produce);
        return mt_obj.savemeterial_produce(meterial_produce);
      }
    });
};

meterial_produce.prototype.outputmeterial_produce = function outputmeterial_produce(){
  var mt_obj = this;
  this.getmeterial_produce(meterial_produce.mid.toString())
    .then(function(mt){
      // console.log(mt);
      if(mt)
      {
        mt.count -= meterial_produce.count;
        // console.log(mt);
        // console.log('save mt to redis');
        return mt_obj.savemeterial_produce(mt);
      }else
      {
        // console.log('mt not found');
        // console.log(meterial_produce);
        return mt_obj.savemeterial_produce(meterial_produce);
      }
    });
};

module.exports = meterial_produce;
module.exports.meterial_produce = meterial_produce;
