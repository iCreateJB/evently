var redis   = require('./db.js'),
    moment  = require('moment'),
    _und    = require('underscore')

function AdminService(){}

AdminService.createUser = function(req,res,next){

  is_existing_user = function(req,res,callback){
    var existing_user = redis.smembers('users:'+res.body.email)
        existing_user.error(function(err){ console.dir(err); })
        existing_user.done(function(req,res,data){
          if (_und.isEmpty(data)){
            callback(req,res)
          }else{
            res.json({ status: 'Error', detail: 'User Invalid' },200)
          }
        })
  },

  create_user = function(req,res){
    var user_params = req.body.params;
    var save = redis.hmset( 'user:'+user.email, 'data', JSON.stringify(user))
        save.error(function(res,err){ console.dir(err); res.json({status: 'Error'},404) })
        save.done(function(res,data){
          redis.sadd( 'users', 'user:'+data.email,function(err,data){ if (err){ console.dir(err); } });
          redis.sadd( 'api_key:'+data.credentials.api_key, 'user:'+data.email,function(err,data){ if (err){ console.dir(err); }});
          redis.sadd( 'app_id:'+data.app_id, 'user:'+data.email,function(err,data){ if (err){ console.dir(err); }})
          res.json({ user: data },201);
        })
  }

  is_existing_user(req,res,create_user)
}

AdminService.getUser = function(req,res,next){

}

AdminService.createApp = function(req,res,next){

}

AdminService.getApp = function(req,res,next){

}

module.exports = AdminService;
