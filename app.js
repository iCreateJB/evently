var express = require('express'),
    app     = express(),
    Hermes  = require('./lib/hermes.js');

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
  Hermes.authenticate(req,res,next);
  res.on('error', function(e) {
    return console.error(e);
  });
})

app.post('/', function(req,res) {
  if (req.method == 'POST'){
    var _event = new Hermes(req);
        _event.create(res);
  }else{
    res.json({status: 'Error', message: 'Invalid Request Type.'},406)
  }
});

app.get('/ip/:ip', function(req,res){
  var _events = new Hermes(req);
      _events.get(res);
})

app.get('/ping', function(req,res){
  Hermes.status(req,res)
})

app.listen(process.env.PORT || 5000);
