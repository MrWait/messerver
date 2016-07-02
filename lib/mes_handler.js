//
var db = require('./order_db');
var order = require('../module/order');
var Order = order;
var meterial = require('../module/meterial');
var od = new Order();
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

function getallmeterial_online(req, res, next){
  var meterials = [];
  db.getallmeterial_online()
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

function updateorder_online(){
  var orders;
  // 获取全部订单
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
      // 获取全部库存物料
      return db.getallmeterial_online();
    })
    .then(function(data){
      data = JSON.stringify(data);
      data = data.replace(/\\\"/g, "\"");
      data = data.replace(/\"{/g, "{");
      data = data.replace(/}\"/g, "}");
      data = JSON.parse(data);
      for(i in data)
      {
        // console.log(i);
        data[i] = data[i] >> 0;
      }

      var factory = data;
      console.log(factory);
      // 遍历全部订单
      for(i in orders){
        console.log("start process:");
        console.log(i);
        // 获取订单中物料节点
        var mlist = orders[i].meterials;
        var status = "1";
        orders[i].status = "1";
        if(mlist){
          // 遍历物料节点
          mlist.forEach(function(it){
            console.log("mlist:");
            console.log(it);
            // 和库存物料数量对比
            if(factory[it.meterialId])
            {
              if(mlist.meterialNum > factory[it.meterialId])
              {
                status = "0";
              }
            }
            else
            {
              status = "0";
            }
          });
        }else{
          status = "0";
        }
        if(status !== orders[i].status)
        {
          orders[i].status = status;
          db.saveorder(i, JSON.stringify(orders[i]));
        }
      }
    });
}

function updateorder(){
  var orders;
  // 获取全部订单
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
      // 获取全部库存物料
      return db.getallmeterial();
    }).then(function(data){
      data = JSON.stringify(data);
      data = data.replace(/\\\"/g, "\"");
      data = data.replace(/\"{/g, "{");
      data = data.replace(/}\"/g, "}");
      data = JSON.parse(data);
      for(i in data)
      {
        // console.log(i);
        data[i] = data[i] >> 0;
      }

      var factory = data;
      console.log(factory);
      // 遍历全部订单
      for(i in orders){
        console.log("start process:");
        console.log(i);
        // 获取订单中物料节点
        var mlist = orders[i].meterials;
        var status = "1";
        orders[i].status = "1";
        if(mlist){
          // 遍历物料节点
          mlist.forEach(function(it){
            console.log("mlist:");
            console.log(it);
            // 和库存物料数量对比
            if(factory[it.meterialId]){
              if(mlist.meterialNum > factory[it.meterialId]){
                status = "0";
              }
            }else{
              status = "0";
            }});
        }else{
          status = "0";
        }
        if(status !== orders[i].status){
          orders[i].status = status;
          if(status === '1')
          {
            orders[i].process = 'ready';
          }
          db.saveorder(i, JSON.stringify(orders[i]));
        }}});
}

var local_data_orders = {
  48:{
  // status:[0, 1]
  // process:[wait, ready, processing, done]
    orderId:48,
    status:0,
    process: 'wait',
    meterials:[{meterialsId:'m10001',
                count: 100},
               {meterialsId: 'm10002',
                count: 200}]}
};

var local_data_meterials = {
  m10001:{meteriasId: 'm10001', count: 2000}
};


// 获取全部订单状态。返回订单id，状态，生产进程
function getallorder(req, res, next){
  var ret;
  od.getallorder()
    .then(function(orders){
      if(orders)
      {
        // console.log("got orders");
        // console.log(orders);
        ret = od.showorders(orders);
        // console.log(ret);
        res.write(JSON.stringify(ret));
        res.end();
      }
      else
      {
        next();
      }
    });
  // next();
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
  if(req.body && req.body.id && req.body.readerid)
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

function inputmeterial_online(req, res, next){
  console.log(req.body);
  res.write('ok');
  res.end();
}

// 订单相关
module.exports.initorder = initorder;
module.exports.getallorder = getallorder;

// 库存物料
module.exports.initmeterial = initmeterial;
module.exports.inputmeterial = inputmeterial;
module.exports.getallmeterial = getallmeterial;
module.exports.inputmeterialid = inputmeterialid;

// 产线物料
module.exports.getallmeterial_online = getallmeterial_online;
