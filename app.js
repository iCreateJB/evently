var express = require('express');
var app     = express();
var redis   = require('redis');
    client  = redis.createClient(process.env['REDIS_PORT'],process.env['REDIS_HOST']);
    client.auth(process.env['REDIS_AUTH_PASS']);
    
    client.on("error", function (err) {
      console.log("error event - " + client.host + ":" + client.port + " - " + err);
    });

app.set('json spaces',0)
app.get('/', function(req,res) {
  client.set("galileo:ip:"+req.connection.remoteAddress, req.connection.remoteAddress, redis.print);
  res.json({ip: req.connection.remoteAddress});
});

app.listen(process.env.PORT || 5000);
