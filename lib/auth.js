var redis   = require('./db.js'),
    moment  = require('moment'),
    _und    = require('underscore')

function Auth(){}

Auth.authenticate = function(req,res,next){

  valid_requestType = function(req,res,callback){
    if ((!req.is('json') || !req.is('application/json')) && req.method == 'POST'){
      res.json({status: 'Error', message: 'Invalid Request Type.'},406)
    }else{
      callback(req,res,valid_key)
    }
  },

  has_key = function(req,res,callback){
    if (!_und.has(req.headers,'authorization')){
      unauthorized(req,res)
    }else{
      callback(req,res,valid_app_id)
    }
  },

  valid_key = function(req,res,callback){
    redis.smembers('api_key:'+req.headers.authorization,function(err,data){
      if (_und.isEmpty(data)){
        unauthorized(req,res);
      }else{
        callback(req,res)
      }
      if (err) { console.dir(moment().format()+' : '+err) }
    })
  },

  valid_app_id = function(req,res){
    app_id = req.method == 'GET' ? req.query.app_id : req.body.app_id
    redis.smembers('app_id:'+app_id,function(err,data){
      if (_und.isEmpty(data)){
        invalidAppKey(req,res)
      }else{
        redis.hget(_und.first(data),'data',function(err,data){
          if (JSON.parse(data).credentials.api_key == req.headers.authorization){
            next();
          }else{
            invalidAppKey(req,res)
          }
        })
      }
    })
  }

  valid_requestType(req,res,has_key,next)
}

function unauthorized(req,res){
  // Track Unauthorized events
  _und.extend(req.body, {occurance: moment().format()})
  redis.hmset( 'unauthorized', 'data', JSON.stringify(req.body), function(err,result){ if(err){ console.dir(moment().format()+' : '+err); } })
  res.json({status: 'Unauthorized', message: 'Invalid API Key.'},401)
}

function invalidAppKey(req,res){
  // Track Unauthorized events
  _und.extend(req.body, {occurance: moment().format()})
  redis.hmset( 'unauthorized:key', 'data', JSON.stringify(req.body), function(err,result){ if(err){ console.dir(moment().format()+' : '+err); } })
  res.json({status: 'Unauthorized', message: 'Invalid App Key.'},401)
}

module.exports = Auth;
