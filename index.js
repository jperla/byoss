var app = require('express')();
var http = require('http').Server(app);

app.get('/', function(req, res) {
  res.send('<h1>Hello world</h1>');
});

io.on('connection', function(socket) {
  console.log('a user connected');
});

var port = process.env.PORT || 3000;
http.listen(port, function() {
  console.log('listening on *:' + port);
});
