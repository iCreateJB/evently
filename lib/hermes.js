var redis   = require('redis-url').connect(process.env.REDISTOGO_URL),
    moment  = require('moment'),
    _und    = require('underscore'),
    async   = require('async'),
    Event   = require('./event.js');

function Hermes(req){
  this.req  = req;
  this.ip   = req.params.ip;
}

Hermes.prototype.create = function(res){
  var req   = this.req;
  var params= req.body;
  reqIp      = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  newEvent   = new Event(params,reqIp)
  res.json({ status: 'success', data: newEvent},201)
}

Hermes.prototype.get = function(res){
  var ipAdd     = this.ip;
  redis.zcard('ip:'+ipAdd, function(err,count){
    redis.zrange('ip:'+ipAdd, 0, 100, function(err, events){
      async.map(events, redis.hgetall.bind(redis), function(err,i){
        res.json({ count: count, ip: ipAdd, data: i })
      })
    })
  });
}

Hermes.authenticate = function(req,res,next){
  next();
}

Hermes.status = function(req,res){
  res.json({status: redis.ping() == true ? 'Ok' : 'Down'})
}

module.exports = Hermes;
