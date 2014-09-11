var redis   = require('./db.js'),
    moment  = require('moment'),
    _und    = require('underscore')

function AdminService(){}

AdminService.createUser = function(req,res){

  userObj = function(data){
    return {
      user_id: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      status: 'Enabled',
      api_key: data.credentials.api_key,
      app_ids: [
        {
          app_id: data.app_id
        }
      ]
    }
  },

  is_existing_user = function(req,res,callback){
    var existing_user = redis.smembers('users:'+req.body.user.email,function(err,data){
      if (err){ console.dir(err); }
      if (_und.isEmpty(data)){
        callback(req,res)
      }else{
        res.json({ status: 'Error', detail: 'User Invalid' },200)
      }
    })
  },

  create_user = function(req,res){
    var user_params = req.body.user;
    var save = redis.hmset( 'user:'+user_params.email, 'data', JSON.stringify(user_params),function(err,data){
      if (err){ console.dir(err); res.json({status: 'Error'},400)}
      redis.sadd( 'users', 'user:'+user_params.email,function(err,data){ if (err){ console.dir(err); } });
      redis.sadd( 'api_key:'+user_params.credentials.api_key, 'user:'+user_params.email,function(err,data){ if (err){ console.dir(err); }});
      redis.sadd( 'app_id:'+req.body.app_id, 'user:'+user_params.email,function(err,data){ if (err){ console.dir(err); } })
      user_params.app_id = req.body.app_id
      res.json({ status: 'success', data: userObj(user_params) },201);
    })
  }

  is_existing_user(req,res,create_user)
}

AdminService.getUser = function(req,res){

}

AdminService.createApp = function(req,res){

}

AdminService.getApp = function(req,res){

}

module.exports = AdminService;
