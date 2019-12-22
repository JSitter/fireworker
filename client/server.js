var path = require('path');
var express = require('express');

var app = express();

app.use(express.static(path.join(__dirname, 'dist')));
//Front end routes that may be hit by the back end.  
app.get('/emissions', (req, res)=>{
  res.redirect("/");
})
app.get('/population', (req, res)=>{
  res.redirect("/");
})
app.get('/temperatures', (req, res)=>{
  res.redirect("/");
})
app.set('port', process.env.PORT || 8080);

var server = app.listen(app.get('port'), function() {
  console.log('Listening on port ', server.address().port);
});
