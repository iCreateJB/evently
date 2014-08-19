if (process.env.NODE_ENV != 'test'){
  var redis   = require('redis-url').connect(process.env.REDISTOGO_URL);

    redis.on('connect', function(){
        return console.log('[Connected]');
    });

    redis.on('error', function(e) {
        return console.error(e);
    });
}else{
  var redis = require("fakeredis").createClient();
}

module.exports = redis;
