var express = require('express');
var app     = express();
var redis   = require('redis-url').connect(process.env.REDISTOGO_URL);
var moment  = require('moment');

app.set('json spaces',0)
app.get('/', function(req,res) {
  redis.set("galileo:ip:"+getIp(req)+":"+timestamp(), getIp(req));
  redis.sadd("galileo:ip:"+getIp(req),"galileo:ip:"+getIp(req)+":"+timestamp());
  res.json({ip: getIp(req)});
});

function timestamp(){
  return moment().format('YYYY-MM-DD');
}

function getIp(req){
  var ipAddress;
  var forwardedIpsStr = req.header('x-forwarded-for');
  if (forwardedIpsStr){
    var forwardedIps = forwardedIpsStr.split(',');
    ipAddress = forwardedIps[0];
  }
  if (!ipAddress) {
    ipAddress= req.connection.remoteAddress;
  }
  return ipAddress;
}

app.listen(process.env.PORT || 5000);
