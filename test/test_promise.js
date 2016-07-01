var Q = require('q');
var fs = require('fs');

var jstext = "{ order1: '{\"status\":\"not\",\"meterials\":{\"m10001\":40,\"m10002\":50}}', order2: '{\"status\":\"not\",\"meterials\":{\"m10001\":30,\"m10002\":60}}' }";
jstext.replace(/'+/g, '');
// jstext = JSON.parse(jstext);
console.log(jstext);
exit();
var orders = {
  "order1":{"status":"not", "meterials":{"m10001":40, "m10002": 50}},
  "order2":{"status":"not", "meterials":{"m10001":30, "m10002": 60}}
};

var factory = {
  "m10001": 30,
  "m10002": 100
};
console.log("orders:");
for(i in orders){
  console.log(i);
  console.log(orders[i]);
}
console.log("factory:");
console.log(factory);
// order1 = orders.order1;
// console.log(orders.order1);
// var mtr = order1.meterials;
// for(item in mtr){
//   console.log(item);
//   console.log(mtr[item]);
//   console.log(mtr[item]);
// }

for(i in orders){
  console.log("start process:");
  console.log(i);
  mlist = orders[i].meterials;
  orders[i].status = "ok";
  if(mlist){
    for(it in mlist){
      console.log(it);
      if(factory[it])
      {
        if(mlist[it] > factory[it]){
          orders[i].status = "not";
        };
      }else{
        orders[i].status = "not";
      }
    }
  }else{
    orders[i].status = "not";
  }
}

for(i in orders){
  console.log(orders[i]);
}

  ;
var readFile = function(file){
  var defer = Q.defer();
  fs.readFile(file, function(err, data){
    if(!err){
      defer.resolve(data);
    }else{
      defer.reject(err);
    }
  });
  return defer.promise;
};

readFile("exam.txt").then(console.log, console.error).done();


console.log('done');
