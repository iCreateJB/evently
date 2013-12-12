var express = require('express');
var app     = express();
var redis   = require('redis-url').connect(process.env.REDISTOGO_URL);
var moment  = require('moment');
var url     = require('url');
var newrelic= require('newrelic');

var entries = []

app.set('json spaces',0)
app.get('/', function(req,res) {
  var parts = url.parse(req.url, true);
  var query = parts.query;
  if (query['ip']){
    redis.sort("galileo:ip:"+query['ip'],"ALPHA", function(err,data){
      res.json({ count: data.length, ip: query['ip'], data: data})
    })
  }else{
    redis.set("galileo:ip:"+getIp(req)+":"+timestamp(), getIp(req));
    redis.sadd("galileo:ip:"+getIp(req),"galileo:ip:"+getIp(req)+":"+timestamp());
    res.json({ip: getIp(req)});
  }
});

function report(entries,data,ipAddress){
  
}

function timestamp(){
  return moment().format('YYYY-MM-DDTHH:mm:ssZ');
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
