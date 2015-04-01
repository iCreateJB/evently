var express = require('express'),
    app     = express(),
    admin   = express(),
    Hermes  = require('./lib/hermes.js'),
    Auth    = require('./lib/auth.js'),
    AdminService   = require('./lib/admin_service.js');

app.use(express.bodyParser());

app.configure('development',function(){
  app.use(express.logger('dev'));
})

app.configure('production',function(){
  var newrelic = require('newrelic');
  app.enable('trust proxy');
  app.set('json spaces',0)
})

app.use('/admin', admin);

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

app.get('/activity',function(req,res){
  new Hermes.activity(req,res)
})

app.get('/event/:event_id',function(req,res){
  new Hermes.findByEventId(req,res)
})

app.get('/type',function(req,res){
  new Hermes.type(req,res)
})

app.get('/ping', function(req,res){
  new Hermes.status(req,res)
})

admin.post('/user',function(req,res){
  new AdminService.createUser(req,res)
})

admin.post('/app', function(req,res){
  res.json({ status: 'Ok'})
})

admin.get('/user/:user_id',function(req,res){
  new AdminService.getUser(req,res)
})

app.listen(process.env.PORT || 5000);

module.exports = app;
