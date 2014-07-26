var redis   = require('redis-url').connect(process.env.REDISTOGO_URL),
    moment  = require('moment'),
    uuid    = require('node-uuid');

function Event(data,ip){
   this.data = data;
   this.ip   = ip;
   recEvent  = this.create();
   return recEvent;
}

Event.prototype.create = function(){
  data      = this.data;
  timestamp = moment().format();
  reqIp     = this.ip;
  newEvent  =  {
      'app_id': data.app_id,
      'api_key': data.api_key,
      'event_id': uuid.v4(),
      'ip': this.ip,
      'params': data,
      'timestamp': timestamp,
      'status': data.status,
      'error': data.error
    };
  processEvent = newEvent;
  redis.hmset('request'+':'+reqIp+':'+timestamp,newEvent);
  this.process(processEvent);
  return newEvent;
}

Event.prototype.process = function(data){
  redis.zadd('ip:'+data.ip,0,'request'+':'+data.ip+':'+data.timestamp)
  redis.zadd('app_id:'+data.app_id,0,'request'+':'+data.ip+':'+data.timestamp)
  redis.zadd('api_key:'+data.api_key,0,'request'+':'+data.ip+':'+data.timestamp)
  redis.zadd('event_id:'+data.event_id,0,'request'+':'+data.ip+':'+data.timestamp)
}

module.exports = Event;
