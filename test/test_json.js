var jstext = "{ order1: '{\"status\":\"not\",\"meterials\":{\"m10001\":40,\"m10002\":50}}', order2: '{\"status\":\"not\",\"meterials\":{\"m10001\":30,\"m10002\":60}}' }";
// jstext.replace(/1/g, '3');
// jstext = str(jstext);
jstext = jstext.toString();
var t = jstext.replace(/'/g, "");
// jstext.replace("'", '');
// jstext = JSON.parse(jstext);
// console.log(jstext);
console.log(t);

var order1 = {"order1":{"status":"not", "meterials":{"m10001":40, "m10002": 50}}};
console.log(JSON.stringify(order1));
var order2 = {"order1":"{\"status\":\"not\",\"meterials\":{\"m10001\":40,\"m10002\":50}}","order2":"{\"status\":\"not\",\"meterials\":{\"m10001\":30,\"m10002\":60}}"};
console.log(order2);
order2 = JSON.stringify(order2);
console.log(order2);
order2 = order2.replace(/\\\"/g, "\"");
console.log(order2);
order2 = order2.replace(/\"{/g, "{");
console.log(order2);
order2 = order2.replace(/}\"/g, "}");
console.log(order2);

var order3 = JSON.parse(order2);
console.log(order3);
console.log(order3.order1.status);
console.log(JSON.stringify(order3));
str =   "[{'bomItemId': 10011, 'bomQty': 1000, 'bomCosting': 20000 },{'bomItemId': 100, 'bomQty': 1000, 'bomCosting': 20000 }]";

var o = {
  'bomInfo': str
};
