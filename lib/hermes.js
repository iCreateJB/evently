var redis   = require('./db.js'),
    moment  = require('moment'),
    _und    = require('underscore'),
    async   = require('async'),
    Event   = require('./event.js');

function Hermes(){ }

Hermes.create = function(req,res){
  var params = req.body;
  reqIp      = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  newEvent   = new Event(params,reqIp)
  newEvent.create();
  res.json({ status: 'success', data: newEvent},201)
}

Hermes.type = function(req,res){
  var messageType = req.param('messageType').toLowerCase();
  redis.zrange('event:type:'+messageType+':'+req.param('app_id'),0,-1,function(err,result){
    if (err){ console.dir(err) }
    async.map(result, redis.hgetall.bind(redis), function(err,i){
      res.json({ count: i.length, data: i})
    })
  })
}

Hermes.activity = function(req,res){
  redis.zrange('event:app_id:'+req.param('app_id'),0,-1,function(err,result){
    if (err){ console.dir(err) }
    async.map(result, redis.hgetall.bind(redis), function(err,i){
      res.json({ count: i.length, data: i})
    })
  })
}

Hermes.findByEventId = function(req,res){
  var eventId = req.params.event_id;
  redis.zrange('event:event_id:'+eventId,0,1,function(err,result){
    if (err){ console.dir(err)}
    redis.hgetall(result,function(err,data){
      res.json({ data: data})
    })
  })
}

Hermes.status = function(req,res){
  res.json({status: redis.ping() == true ? 'Ok' : 'Down'})
}

module.exports = Hermes;
