var express = require('express');
var app     = express();
var redis   = require('redis-url').connect(process.env.REDISTOGO_URL);
var moment  = require('moment');

app.set('json spaces',0)
app.get('/', function(req,res) {
  redis.set("galileo:ip:"+req.connection.remoteAddress+":"+timestamp(), req.connection.remoteAddress);
  redis.sadd("galileo:ip:"+req.connection.remoteAddress,"galileo:ip:"+req.connection.remoteAddress+":"+timestamp());
  res.json({ip: req.connection.remoteAddress});
});

function timestamp(){
  return moment().format('YYYY-MM-DD');
}

app.listen(process.env.PORT || 5000);
