var express = require('express');
var app     = express();
var redis   = require('redis-url').connect(process.env.REDISTOGO_URL);

app.set('json spaces',0)
app.get('/', function(req,res) {
  redis.set("galileo:ip:"+req.connection.remoteAddress, req.connection.remoteAddress);
  res.json({ip: req.connection.remoteAddress});
});

app.listen(process.env.PORT || 5000);
