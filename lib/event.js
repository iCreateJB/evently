var redis   = require('./db.js'),
    moment  = require('moment'),
    _und    = require('underscore'),
    uuid    = require('node-uuid');

function Event(data,ip){
   this.reqData = data;
   this.ip      = ip;
   this.error   = {};
   return;
}

Event.prototype.create = function(){
  data      = this.reqData;
  timestamp = moment().format();
  reqIp     = this.ip;
  newEvent  =  {
      'app_id': data.app_id,
      'event_id': uuid.v4(),
      'ip': this.ip,
      'params': JSON.stringify(data),
      'timestamp': timestamp,
      'status': data.messageType,
      'detail': data.messageDetail
    };
  processEvent = newEvent;
  redis.hmset('request'+':'+reqIp+':'+timestamp,newEvent, function(err,res){
    if (err){
      console.dir(moment().format()+' : '+err)
    }
  });
  this.process(processEvent);
  return newEvent;
}

Event.prototype.process = function(data){
  redis.zadd('ip:'+data.ip,0,'request'+':'+data.ip+':'+data.timestamp)
  redis.zadd('event:app_id:'+data.app_id,0,'request'+':'+data.ip+':'+data.timestamp)
  redis.zadd('event:api_key:'+data.api_key,0,'request'+':'+data.ip+':'+data.timestamp)
  redis.zadd('event:event_id:'+data.event_id,0,'request'+':'+data.ip+':'+data.timestamp)
}

module.exports = Event;
