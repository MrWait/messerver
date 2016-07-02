var Q = require('q');
var db = require('../lib/order_db');

var order = function(){

};

order.prototype.saveorder = function saveorder(order){
  return db.saveorder(order.orderid, order);
};

order.prototype.getorderbyid = function getorderbyid(orderid){
  return db.getorder(orderid);
};

order.prototype.getallorder = function getallorder(){
  var ret = [];
  return db.getallorder()
    .then(function (orders){
      orders = JSON.stringify(orders);
      orders = orders.replace(/\\\"/g, "\"").replace(/\"{/g, "{").replace(/}\"/g, "}").replace(/\'{\"/g, "{\"")
        .replace(/]}\'/g, "]}");
      orders = JSON.parse(orders);
      console.log("create order");
      for(i in orders){
        var order;
        if(orders[i].orderId)
        {
          order = {
            orderid: orders[i].orderId,
            status: orders[i].status || 0,
            process: orders[i].process || 'wait'
          };
          ret.push(order);
        }
      }
      return ret;
    });
};

order.prototype.showorders = function showorders(orders){
  var ret = [];
  for(i in orders){
    ret.push({orderid: orders[i].orderid || 0,
              status: orders[i].status || 0,
              process: orders[i].process || 'wait'});
  }
  return ret;
};

order.prototype.updateorder = function updateorder(order, param){
  var changed = 0;
  for(i in param){
    if(order[i] && order[i] !== param[i])
    {
      order[i] = param[i];
    }
  }

  if(changed){
    saveorder(order);
  }
};

order.prototype.createorder = function createorder(orderid, status, process, meterials){
  if(orderid){
    order = {
      orderid: orderid,
      status: status || 0,
      process: process || 'wait'
    };
    return order;
  }else
  {
    return null;
  }
};

module.exports = order;
module.exports.order = order;
