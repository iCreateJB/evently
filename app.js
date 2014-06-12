var express = require('express');
var app     = express();
var redis   = require('redis-url').connect(process.env.REDISTOGO_URL);
var moment  = require('moment');
var url     = require('url');
var _und    = require('underscore');
var newrelic= require('newrelic');

var entries = []

app.set('json spaces',0)
app.get('/', function(req,res) {
  var parts = url.parse(req.url, true);
  var query = parts.query;
  if (query['ip']){
    // SORT '127.0.0.1' ASC ALPHA
    redis.sort(query['ip'],"ALPHA", function(err,data){
      res.json({ count: data.length, ip: query['ip'], data: data})
    })
  }else{
    redis.set(getIp(req)+":"+timestamp(), getIp(req));
    redis.sadd(getIp(req),getIp(req)+":"+timestamp());
    res.json({ip: getIp(req)});
  }
});

app.get('/ping', function(req,res){
  status = redis.ping();
  res.json({status: status == true ? 'Ok' : 'Down'})
})

function report(entries,data,ipAddress){

}

function timestamp(){
  // > moment().unix()
  // 1402531523
  // > moment().valueOf(moment().unix())
  // 1402531537034
  // > moment(1402531537034).format('MM/DD/YYYY')
  return moment().valueOf(moment().unix())
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
