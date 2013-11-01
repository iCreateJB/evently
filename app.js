var express = require('express');
var app     = express();

app.get('/', function(req,res) {
  res.json({ip: req.connection.remoteAddress});
});

app.listen(process.env.PORT || 4730);
