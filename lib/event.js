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
  newEvent  = this.recEvent(data);
  redis.hmset('request'+':'+this.ip+':'+newEvent.timestamp,newEvent, function(err,res){
    if (err){ console.dir(moment().format()+' : '+err) }
  });
  this.process(newEvent);
  this.processByType(newEvent);
  return newEvent;
}

Event.prototype.process = function(data){
  redis.zadd('ip:'+data.ip,0,'request'+':'+data.ip+':'+data.timestamp)
  redis.zadd('event:app_id:'+data.app_id,0,'request'+':'+data.ip+':'+data.timestamp)
  redis.zadd('event:api_key:'+data.api_key,0,'request'+':'+data.ip+':'+data.timestamp)
  redis.zadd('event:event_id:'+data.event_id,0,'request'+':'+data.ip+':'+data.timestamp)
}

Event.prototype.processByType = function(data){
  switch(data.status.toLowerCase()){
    case 'info':  redis.zadd('event:type:info:'+data.app_id,0,'request'+':'+data.ip+':'+data.timestamp); break;
    case 'error': redis.zadd('event:type:error:'+data.app_id,0,'request'+':'+data.ip+':'+data.timestamp); break;
    case 'debug': redis.zadd('event:type:debug:'+data.app_id,0,'request'+':'+data.ip+':'+data.timestamp); break;
    default: redis.zadd('event:type:'+data.app_id,0,'request'+':'+data.ip+':'+data.timestamp); break;
  }
}

Event.prototype.recEvent = function(data){
  return {
    'app_id': data.app_id,
    'event_id': uuid.v4(),
    'ip': this.ip,
    'params': JSON.stringify(data),
    'timestamp': moment().toISOString(),
    'status': data.messageType,
    'detail': data.messageDetail
  }
}

module.exports = Event;
