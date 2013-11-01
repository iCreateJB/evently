var express = require('express');
var app     = express();

app.set('json spaces',0)
app.get('/', function(req,res) {
  res.json({ip: req.connection.remoteAddress});
});

app.listen(process.env.PORT || 5000);
