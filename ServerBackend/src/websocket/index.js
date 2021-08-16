import { Server as WebSocketServer } from 'ws';

const wss = new WebSocketServer({port: 8080, path: '/myapp'});

wss.on('connection', function(ws) {
    console.log('new connection');
    ws.send('Msg from server');
});

ws.on('message', function(message) {
    console.log('Msg received in server: %s ', message);
});