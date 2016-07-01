//
var Q = require('q');
var db = require('../test/order_db');
function getallmeterial(req, res, next){
  var meterials = [];
  db.getallmeterial()
    .then(function(data){
      console.log(data);
      data = JSON.stringify(data);
      data = data.replace(/\\\"/g, "\"");
      console.log(data);
      data = data.replace(/\"{/g, "{");
      console.log(data);
      data = data.replace(/}\"/g, "}");
      console.log(data);
      data = JSON.parse(data);
      for(i in data)
      {
        console.log(i);
        data[i] = data[i] >> 0;
        var mtr = {};
        mtr.mid = i;
        mtr.count = data[i];
        meterials.push(mtr);
      }
      // data = JSON.stringify(data);
      // res.write(data);
      res.write(JSON.stringify(meterials));
      res.end();
    });
}

function initorder(req, res, next){
  // var order1 = {"order1":{"status": 0, "meterials":{"m10001":40, "m10002": 50}}};
  // var order2 = {"order2":{"status": 0, "meterials":{"m10001":30, "m10002": 60}}};
  var order1 = {"orderId": 100, "status": "not", "meterials":[{"meterialId":20001, "meterialNum":40}, {"meterialId": 20002, "meterialNum": 50}]};
  var order2 = {"orderId": 101, "status": "not", "meterials":[{"meterialId":20001, "meterialNum":60}, {"meterialId": 20002, "meterialNum": 40}]};
  db.saveorder(order1.orderId, JSON.stringify(order1))
    .then(function(){
      console.log(JSON.stringify(order2));
      return db.saveorder(order2.orderId, JSON.stringify(order2));
    })
    .then(function(){
      res.write('ok');
      res.end();
    });
}

function updateorder(){
  var orders;
  db.getallorder()
    .then(function(data){
      data = JSON.stringify(data);
      data = data.replace(/\\\"/g, "\"");
      data = data.replace(/\"{/g, "{");
      data = data.replace(/}\"/g, "}");
      data = data.replace(/\'{\"/g, "{\"");
      data = data.replace(/]}\'/g, "]}");
      console.log(data);
      data = JSON.parse(data);
      orders = data;
      console.log(orders);
      return db.getallmeterial();
    })
    .then(function(data){
      data = JSON.stringify(data);
      data = data.replace(/\\\"/g, "\"");
      data = data.replace(/\"{/g, "{");
      data = data.replace(/}\"/g, "}");
      data = JSON.parse(data);
      for(i in data)
      {
        console.log(i);
        data[i] = data[i] >> 0;
      }

      var factory = data;
      console.log(factory);
      for(i in orders){
        console.log("start process:");
        console.log(i);
        var mlist = orders[i].meterials;
        orders[i].status = "ok";
        if(mlist){
          mlist.forEach(function(it){
            console.log("mlist:");
            console.log(it);
            if(factory[it.meterialId])
            {
              if(mlist.meterialNum > factory[it.meterialId])
              {
                orders[i].status = "not";
              }
            }
            else
            {
              orders[i].status = "not";
            }
          });


          // for(it in mlist){
          //   console.log(it);
          //   if(factory[it])
          //   {
          //     if(mlist[it] > factory[it]){
          //       orders[i].status = "not";
          //     };
          //   }else{
          //     orders[i].status = "not";
          //   }
          // }
        }else{
          orders[i].status = "not";
        }
        db.saveorder(i, JSON.stringify(orders[i]));
      }
    });

}

function getallorder(req, res, next){
  var orders = [];
  var meterials;
  var data2;

  // updateorder();
  db.getallorder()
    .then(function(data){
      console.log("data:");
      console.log(data);
      data = JSON.stringify(data);
      data = data.replace(/\\\"/g, "\"");
      data = data.replace(/\"{/g, "{");
      data = data.replace(/}\"/g, "}");
      data = data.replace(/\'{\"/g, "{\"");
      data = data.replace(/]}\'/g, "]}");
      console.log(data);
      data2 = JSON.parse(data);
      console.log(data2);

      for(i in data2){
        console.log(i);
        var order = {};
        order.orderid = i;
        order.status = data2[i].status;
        orders.push(order);
      }
      console.log(orders);
      orders = '' + JSON.stringify(orders);
      // res.write(data);
      res.write(orders);
      // res.write(orders.toString());

      res.end();
    });
}

function initmeterial(req, res, next){
  var order = {
    'mid': 20001,
    'count': 100
  };
  var order1 = {
    'mid': 20002,
    'count': 600
  };
  db.savemeterial(order)
    .then(function(data){
      return db.savemeterial(order1);
    })
    .then(function(data){
      res.write('ok');
      res.end();
      updateorder();
      // next();
    });
}

function inputmeterial(req, res, next){
  console.log(req.body);
  res.write('ok');
  res.end();
}

function inputmeterialid(req, res, next){
  if(req.body && req.body.id)
  {
    console.log(req.body);
    var mid = req.body;
    var id = {
      "f6d1f606": 10001,
      "95068543": 1000,
      "05aaa943": 10002,
      "7604ed06": 10003,
      "d5dea143": 10004,
      "469c2f5e": 10005,
      "e6c6615e": 10006,
      "4540e452": 10007,
      "4635355e": 10008,
      "66722f5e": 10009
    };
    if(id[mid.id]){
      console.log(id[mid.id]);
      var m_id = id[mid.id];
      var order = {};
      order.mid = id[mid.id];
      order.count = 50;
      // db.savemeterial(order);
      res.write('ok');
      res.end();
    }else{
      res.write('id not exsits');
      res.end();
    }
    return;
  }
  next();
}

module.exports.getallmeterial = getallmeterial;
module.exports.getallorder = getallorder;
module.exports.inputmeterial = inputmeterial;
module.exports.initorder = initorder;
module.exports.initmeterial = initmeterial;
module.exports.inputmeterialid = inputmeterialid;
