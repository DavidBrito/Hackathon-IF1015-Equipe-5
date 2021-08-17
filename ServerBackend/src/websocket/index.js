import { Server as WebSocketServer } from 'ws';

const wss = new WebSocketServer({port: 8080, path: '/myapp'});

wss.on('connection', function(ws) {
    console.log('New ws connection!');
    ws.send('Server: listening to requests');
});

ws.on('message', function(message) {
    console.log('Msg received in server: %s ', message);
});