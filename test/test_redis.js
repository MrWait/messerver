// {"factory":{"m01": 10, "m02":20}}
// {"order":{"0001":{"meterial":[{"m01":20, "m20":20}]}, "0002":{"meterial":[{"m01":30}]}}}

var redis = require('redis');
var client = redis.createClient('6379', 'localhost');

client.on("error", function(error){
  console.log(error);
});

client.auth('123456');
client.set("key", "val", redis.print);
client.hset("hash key", "hashtest 1", "some value", redis.print);
client.hset(['hash key', "hasttest 2", "some other value"], redis.print);
client.hkeys("hash key", function(err, replies){
  console.log(replies.length + ' replies:');
  replies.forEach(function(reply, i){
    console.log("    " + i + ": " + reply);
  });
});
client.hgetall('hash key', function(err, obj){
  console.dir(obj);
});

client.hget("hash key", "hashtest 1", redis.print);

client.select('15', function(error){
  if(error){
    console.log(error);
  }else{
    client.set('str_key_0', '0', function(error, res){
      if(error){
        console.log(error);
      }else{
        console.log(res);
      }

      // client.end();
    });
  }
});
