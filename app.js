var express = require('express');
var app     = express();
var redis   = require('redis-url').connect(process.env.REDISTOGO_URL);
var moment  = require('moment');
var url     = require('url');
var _und    = require('underscore');
var newrelic= require('newrelic');

app.configure('development',function(){
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
})

app.configure('production',function(){
  app.enable('trust proxy');
  app.set('json spaces',0)
})

app.use(function(req,res,next){
  if (req.method == 'POST'){
    redis.set(getIp(req)+":"+timestamp(), getIp(req));
    redis.sadd(getIp(req),getIp(req)+":"+timestamp());
  }
  next();
})

app.post('/', function(req,res) {
  res.json({status: 'Ok'})
});

app.get('/ip/:ip', function(req,res){
  // var parts = url.parse(req.url, true);
  // var query = parts.query;
  // SORT '127.0.0.1' ASC ALPHA
  redis.sort(req.params.ip,"ALPHA", function(err,data){
    var request = [];
    _und.each(data, function(i){ request.push(_und.object(['ip','timestamp'], i.split(':'))) });
    res.json({ count: data.length, ip: req.params.ip, data: _und.pluck(request,'timestamp') })
  })
})

app.get('/ping', function(req,res){
  status = redis.ping();
  res.json({status: status == true ? 'Ok' : 'Down'})
})

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
