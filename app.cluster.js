var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
var express = require('express'),
    app     = express(),
    admin   = express(),
    Hermes  = require('./lib/hermes.js'),
    Auth    = require('./lib/auth.js'),
    AdminService   = require('./lib/admin_service.js');

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {
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
  Hermes.status(req,res)
})

admin.post('/user',function(req,res){
  AdminService.createUser(req,res)
})

admin.post('/app', function(req,res){
  res.json({ status: 'Ok'})
})

app.listen(process.env.PORT || 5000);
}

module.exports = app;
