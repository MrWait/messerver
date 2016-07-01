var Q = require('q');
var redis = require('redis');
var client = redis.createClient('6379', 'localhost');

client.on("error", function(error){
  console.log(error);
});

client.auth('123456');
client.hset('factory', 'mx10001', 10, redis.print);

client.hget('factory', 'mx10001', redis.print);

client.quit();
