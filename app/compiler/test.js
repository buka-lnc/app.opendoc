const Websocket = require('ws')

const ws = new Websocket('ws://localhost:8081')

ws.on('open', () => {
  console.log('connected')
  ws.send(JSON.stringify({
    event: 'identity',
    data: 'test'
  }))

  ws.onmessage = function(event) {
    console.log(event.data)
  }
})
