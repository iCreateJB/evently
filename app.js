var express = require('express'),
    app     = express(),
    Hermes  = require('./lib/hermes.js'),
    Auth    = require('./lib/auth.js');

app.use(express.bodyParser());

app.configure('development',function(){
  app.use(express.logger('dev'));
})

app.configure('production',function(){
  var newrelic = require('newrelic');
  app.enable('trust proxy');
  app.set('json spaces',0)
})

app.use(function(req,res,next){
  if (req.path == '/ping') next();
  if (req.path == '/' && req.method == 'GET') next();
  new Auth.authenticate(req,res,next);
  res.on('error', function(e) {
    return console.error(e);
  });
})

app.post('/', function(req,res) {
    new Hermes.create(req,res);
});

app.get('/',function(req,res){
  res.json({status: 'Error', message: 'Invalid Request Type.'},406)
})

app.get('/recent/:app_id',function(req,res){
  // new Hermes.get(req,res,'recent')
})

app.get('/activity/:app_id',function(req,res){
  // new Hermes.get(req,res,'activity')
})

app.get('/apps',function(req,res){
  // new Hermes.get(req,res,'apps')
})

app.get('/event/:event_id',function(req,res){
  new Hermes.findByEventId(req,res)
})

app.get('/type',function(req,res){
  // new Hermes.get(req,res,'status')
})

app.get('/ping', function(req,res){
  Hermes.status(req,res)
})

app.listen(process.env.PORT || 5000);

module.exports = app;
