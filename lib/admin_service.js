var redis   = require('./db.js'),
    moment  = require('moment'),
    _und    = require('underscore'),
    uuid    = require('node-uuid');

function response(data){
  return {
    user_id: data.email,
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    status: 'Enabled',
    api_key: data.api_key,
    apps: []
  }
}

function AdminService(){}

AdminService.createUser = function(req,res){
  is_existing_user = function(req,res,callback){
    var existing_user = redis.hgetall('user:'+req.body.user.email,function(err,data){
      if (err){ console.dir(err); }
      if (_und.isEmpty(data)){
        callback(req,res)
      }else{
        res.json({ status: 'Error', detail: 'User Invalid' },400)
      }
    })
  },

  create_user = function(req,res){
    var user_params         = req.body.user;
        user_params.api_key = uuid.v4();
    redis.hmset( 'user:'+user_params.email, 'data', JSON.stringify(user_params),function(err,data){
      if (err){ console.dir(err); res.json({status: 'Error'},400)}
      redis.zadd( 'users', 0,'user:'+user_params.email,function(err,data){ if (err){ console.dir(err); } });
      redis.zadd( 'api_key:'+uuid.v4(), 0,'user:'+user_params.email,function(err,data){ if (err){ console.dir(err); }});
      // redis.zadd( 'app_id:'+req.body.app_id, 0,'user:'+user_params.email,function(err,data){ if (err){ console.dir(err); } })
      // redis.zadd( 'users:apps:'+user_params.email,0,req.body.app_id,function(err,data){ if (err){ console.dir(err); } })
      // user_params.app_id = req.body.app_id
      res.json(response(user_params),201);
    })
  }
  is_existing_user(req,res,create_user)
}

AdminService.getUser = function(req,res){
  redis.hgetall('user:'+req.params.user_id,function(err,data){
    if (err){ console.dir(err); }
    if (_und.isEmpty(data)){
      res.json({ status: 'Error', detail: 'User Invalid' },400)
    }else{
      res.json(response(JSON.parse(data.data)),200)
    }
  })
}

AdminService.createApp = function(req,res){

}

AdminService.getApps   = function(req,res){
  retrieve = function(req,res){

  }

  retrieve(req,res)
}

module.exports = AdminService;
