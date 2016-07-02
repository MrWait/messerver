var redis = require('redis');
var Q = require('q');

var client = redis.createClient('6379', 'localhost');

client.on("error", function(error){
  console.log(error);
});

client.auth('123456');
var order_db = {};
order_db.saveorder = function(orderid, order){
  var defer = Q.defer();
  client.hset('order', orderid, JSON.stringify(order), function(err, data){
    defer.resolve(data);
  });
  return defer.promise;
};

order_db.getorder = function(orderid){
  var defer = Q.defer();
  client.hget('order', orderid, function(err, data){
    // console.log(data);
    defer.resolve(data);
  });
  return defer.promise;
};

order_db.getallorder = function(){
  var defer = Q.defer();
  client.hgetall('order', function(err, data){
    // console.log(data);
    defer.resolve(data);
  });
  return defer.promise;
};

order_db.savemeterial = function(meterial){
  var defer = Q.defer();
  // console.log('db savemeterial');
  // console.log(meterial.mid);
  // console.log(meterial.count);
  // console.log(meterial);
  client.hset('factory', meterial.mid, Number(meterial.count), function(err, data){
    if(err)
    {
      // console.log(err);
    }
    // console.log('db savemeterial');
    // console.log(data);
    defer.resolve(data);
  });
  return defer.promise;
};

order_db.getmeterial = function(orderid){
  var defer = Q.defer();
  client.hget('factory', orderid, function(err, data){

    if(err)
    {
      // console.log('meterial not get');
      defer.resolve(null);
    }else
    {
      // console.log('meterial get');
      // console.log(data);
      defer.resolve(data);
    }
  });
  return defer.promise;
};

order_db.getallmeterial = function(){
  var defer = Q.defer();
  client.hgetall('factory', function(err, data){
    if(err){
      defer.reject(err);
    }else{
      defer.resolve(data);
    }
  });
  return defer.promise;
};

order_db.savemeterial_produce = function(order){
  var defer = Q.defer();
  console.log(order.mid);
  console.log(order.count);
  client.hset('factory_produce', order.mid, Number(order.count), function(err, data){
    defer.resolve(data);
  });
  return defer.promise;
};

order_db.getmeterial_produce = function(orderid){
  var defer = Q.defer();
  client.hget('factory_produce', orderid, function(err, data){
    defer.resolve(data);
  });
  return defer.promise;
};

order_db.getallmeterial_produce = function(){
  var defer = Q.defer();
  client.hgetall('factory_produce', function(err, data){
    if(err){
      defer.reject(err);
    }else{
      defer.resolve(data);
    }
  });
  return defer.promise;
};


module.exports = order_db;
module.exports.order_db = order_db;
