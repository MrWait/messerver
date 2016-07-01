var data = {'data':[{"a":0}, {"b":2}]};
var val = data.data;
console.log(val);


val.forEach(function(e){
  console.log(e);
});
val.push({"c":3});
val.forEach(function(e){
  console.log(e);
});

data = '{"100":{"orderId":100,"status":"not","meterials":[{"meterialId":20001,"meterialNum":40},{"meterialId":20002,"meterialNum":50}]},"101":{"orderId":101,"status":"not","meterials":[{"meterialId":20001,"meterialNum":60},{"meterialId":20002,"meterialNum":40}]}}';
console.log(data);
data = JSON.parse(data);
console.log(data);
data = JSON.stringify(data);
console.log(data);
data = JSON.parse(data);
console.log(data);
