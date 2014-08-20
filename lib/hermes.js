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

// Hermes.get = function(req,res){
//   var ipAdd     = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//   redis.zcard('ip:'+ipAdd, function(err,count){
//     redis.zrange('ip:'+ipAdd, 0, 100, function(err, events){
//       async.map(events, redis.hgetall.bind(redis), function(err,i){
//         res.json({ count: count, ip: ipAdd, data: i })
//       })
//     })
//   });
// }

Hermes.get = function(req,res,type){

  recent   = function(){},

  apps     = function(){},

  type     = function(){}

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
