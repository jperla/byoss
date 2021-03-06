var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.get('/', function(req, res) {
  res.send('<h1>Hello world</h1>')
})

var anchors = {}
var clients = {}

io.on('connection', function(socket) {
  console.log('Connecting new socket...')

  var meshNodeId = null

  socket.on('listen', function(id){
    meshNodeId = id
    anchors[meshNodeId] = socket
    console.log('Connecting node %s', meshNodeId)
  })

  socket.on('offer', function(offer){
    if (offer.destination in anchors) {
      var anchor = anchors[offer.destination]
      meshNodeId = offer.source
      clients[offer.source] = socket
      anchor.emit('offer', offer)
      console.log('Offer to %s: %o', offer.destination, offer)
    } else {
      console.log('MeshNodeId %s not an active anchor', offer.destination)
    }
  })

  socket.on('answer', function(answer){
    if (answer.destination in clients) {
      var client = clients[answer.destination]
      client.emit('answer', answer)
      console.log('Answer to %s: %o', answer.destination, answer)
    } else {
      console.log('MeshNodeId %s not an active client', answer.destination)
    }
  })

  socket.on('disconnect', function(){
    if (meshNodeId) {
      delete anchors[meshNodeId]
    }
    console.log('Active anchors: %o', Object.keys(anchors))
    console.log('Active clients: %o', Object.keys(clients))
  })
  console.log('Active anchors: %o', Object.keys(anchors))
  console.log('Active clients: %o', Object.keys(clients))
})

var port = process.env.PORT || 3000
http.listen(port, function() {
  console.log('listening on *:' + port)
})
