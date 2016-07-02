//
// var db = require('./order_db');
var Order = require('../module/order');
var Meterial = require('../module/meterial');
var Meterial_Produce = require('../module/meterial_produce');
var od = new Order();
var mt = new Meterial();
var mt_pd = new Meterial_Produce();

var local_data_orders = {
  48:{
  // status:[0, 1]
  // process:[wait, ready, processing, done]
    orderId:48,
    status:0,
    meterials:[{meterialsId:'m10001',
                count: 100},
               {meterialsId: 'm10002',
                count: 200}]}
};

var local_data_meterials = {
  m10001:{meteriasId: 'm10001', count: 2000}
};



function initorder(req, res, next){
  var order1 = {"orderId": 100, "status": 0, "materials":[{"materialId":10001, "materialNum":40}, {"materialId": 10002, "materialNum": 50}]};
  var order2 = {"orderId": 101, "status": 0, "materials":[{"materialId":10001, "materialNum":60}, {"materialId": 10002, "materialNum": 40}]};
  // MBM
  od.saveorder(order1)
    .then(function(){
      console.log(JSON.stringify(order2));
      // MBM
      return od.saveorder(order2);
    })
    .then(function(){
      res.write('ok');
      res.end();
    });
}

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

function updateorder_produce(){
  var orders;
  // 获取全部订单
  od.getallorder()
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
      return mt_pd.getallmeterial_produce();
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
          od.saveorder(i, JSON.stringify(orders[i]));
        }
      }
    });
}

function updateorder(req, res, next){
  _updateorder();
  res.write('ok');
  res.end();
}

function _updateorder(){
  var orders;
  var factory;
  // 获取全部订单
  od.getallorder()
    .then(function(data){
      console.log('mes_handler updateorder getallorder');
      // console.log(data);
      orders = data;
      // 获取全部库存物料
      return mt_pd.getallmeterial_produce();
    }).then(function(data){
      factory = data;
      console.log("mes_handler updateorder getallmeterial");
      console.log(factory);
      // 遍历全部订单
      for(i in orders){
        console.log("start process:");
        console.log(i);
        // 获取订单中物料节点
        var mlist = orders[i].materials;
        if(!mlist)
        {
          continue;
        }
        var status = 1;
        if(mlist){
          console.log("mlist");
          console.log(mlist);
          // 遍历物料节点
          mlist.forEach(function(it){
            console.log("mlist:");
            console.log(it);
            // 和库存物料数量对比
            if(factory[it.materialId]){
              console.log(factory[it.materialId]);
              if(mlist.materialNum > factory[it.materialId]){
                status = 0;
              }
            }else{
              console.log("no material in produce");
              status = 0;
              return;
            }});
        }else{
          console.log("this order has no material");
          status = 0;
        }
        if(status !== orders[i].status){

          orders[i].status = status;
          od.updateorder_status(orders[i], {status: status});
          if(status === 1)
          {
            console.log('produce done.');
          }
        }}});
}

function initmeterial(req, res, next){
  mt.initmeterial();
  res.write('ok');
  res.end();
}

function inputmeterial(req, res, next){
  var meterial = req.body;
  console.log(meterial);
  if(meterial && meterial.mid && meterial.count)
  {
    var mt_input = {};
    mt_input.mid = meterial.mid;
    mt_input.count = Number(meterial.count);
    // mt.savemeterial(mt_input);
    mt.inputmeterial(mt_input);
    res.write('ok');
    res.end();
    // updateorder();
  }else{
    // next();
    res.write('param invalid');
    res.end();
  }
}

function getallmeterial(req, res, next){
  mt.getallmeterial()
    .then(function(meterials){
      res.write(JSON.stringify(meterials));
      res.end();
    }, function(){
      next();
    });
}

function initmeterial_produce(req, res, next){
  mt_pd.initmeterial_produce();
  res.write('ok');
  res.end();
}

// 产线上线
function inputmeterial_produce(req, res, next){
  var meterial = req.body;
  console.log(meterial);
  if(meterial && meterial.mid && meterial.count)
  {
    var mt_input = {};
    mt_input.mid = meterial.mid;
    mt_input.count = Number(meterial.count);
    // mt.savemeterial(mt_input);
    mt_pd.inputmeterial_produce(mt_input);
    res.write('ok');
    res.end();
    // updateorder();
  }else{
    // next();
    res.write('param invalid');
    res.end();
  }

  // if(req.body && req.body.mid && req.body.count)
  // {
  //   var id = {
  //     "f6d1f606": {mid: 10001, count: 100},
  //     "95068543": {mid: 1000, count: 150},
  //     "05aaa943": {mid: 10002, count: 200},
  //     "7604ed06": {mid: 10003, count: 150},
  //     "d5dea143": {mid: 10004, count: 170},
  //     "469c2f5e": {mid: 10005, count: 140},
  //     "e6c6615e": {mid: 10006, count: 140},
  //     "4540e452": {mid: 10007, count: 120},
  //     "4635355e": {mid: 10008, count: 130},
  //     "66722f5e": {mid: 10009, count: 130}
  //   };
  //   var mid = req.body;
  //   if(id[mid.id]){
  //     var mt_input = {mid: id[mid.id].mid, count: id[mid.id].count};
  //     // console.log(mt_input);
  //     var mt_db;
  //     mt.getmeterial(id[mid.id])
  //       .then(function(m){
  //         if(m){
  //           mt_db = m;
  //           console.log("updateorder got meterial from db");
  //           console.log(m);
  //           return mt_pb.getmeterial_produce(id[mid.id]);
  //         }else{
  //           return null;
  //         }
  //       })
  //       .then(function(m){
  //         if(m){
  //           console.log("updateorder got meterial from produce");
  //           console.log(m);
  //           if((m.count + id[mid.id].count) > mt_db.count){
  //             res.write("not enought material");
  //             res.end();
  //           }else
  //           {
  //             mt_pd.inputmeterial_produce(mt_input);
  //             res.write('ok');
  //             res.end();
  //           }
  //         }else
  //         {
  //           res.write("not enought material");
  //           res.end();
  //         }});
  //   }
  //   else
  //   {
  //     res.write("not enought material");
  //     res.end();
  //   }
  // }else{
  //   res.write("not enought material");
  //   res.end();
  // }
}


function getallmeterial_produce(req, res, next){
  mt_pd.getallmeterial_produce()
    .then(function(meterials){
      res.write(JSON.stringify(meterials));
      res.end();
    }, function(){
      next();
    });
}

function inputmeterialid(req, res, next){
  if(req.body && req.body.id && req.body.readerid)
  {
    var id = {
      "f6d1f606": {mid: 10001, count: 100},
      "05aaa943": {mid: 10002, count: 200},
      "7604ed06": {mid: 10003, count: 150},
      "d5dea143": {mid: 10004, count: 170},
      "469c2f5e": {mid: 10005, count: 140},
      "e6c6615e": {mid: 10006, count: 140},
      "4540e452": {mid: 10007, count: 120},
      "4635355e": {mid: 10008, count: 130},
      "66722f5e": {mid: 10009, count: 130},
      "95068543": {mid: 10010, count: 150}
    };
    req.body.mid = id[req.body.id].mid;
    req.body.count = id[req.body.id].count;
    switch(req.body.readerid)
    {
    case 0:
      return inputmeterial(req, res, next);
      break;
    case 1:
      return inputmeterial_produce(req, res, next);
      break;
    default:
      next();
      break;
    }
  }
  else
  {
    res.write('invalid param');
    res.end();
  }
}

// 订单相关
module.exports.initorder = initorder;
module.exports.getallorder = getallorder;
module.exports.updateorder = updateorder;


// 库存物料
module.exports.initmeterial = initmeterial;
module.exports.inputmeterial = inputmeterial;
module.exports.getallmeterial = getallmeterial;
module.exports.inputmeterialid = inputmeterialid;


// 产线物料
module.exports.getallmeterial_produce = getallmeterial_produce;
module.exports.initmeterial_produce = initmeterial_produce;
module.exports.inputmeterial_produce = inputmeterial_produce;
