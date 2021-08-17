import express from "express"
import cors from "cors"
import routes from "./routes"
//import './proto';
import { Server as WebSocketServer } from 'ws';
import { ClientBusLocation } from './proto';

class App {
    port = 3001;
    constructor() {
        this.server = express()
        this.server.use(cors());
        this.server.use(express.json())
        this.server.use(routes)
        this.server.listen(this.port, (port) => {
            console.log(`Express Listening at port ${this.port}`)
        })

        // inicia o websocket na porta 3002
        const wss = new WebSocketServer({ port: 3002, path: '/myapp' });
        wss.on('connection', function (ws) {

            ws.on('message', function (busid) {
                console.log(`Received from WS client: ${busid}`)

                // toda vez que receber um busid consume da fila de messagens
                const call = ClientBusLocation.consumeQueue({ 'busid': busid }, (err, response) => {
                    console.log('Erro na chamada remota pra consumo da fila', err)
                });
                // a cada dado que receber envia informacoes do onibus pro client
                call.on('data', (data) => {
                    ws.send(data.businfo);
                });
            });

            console.log('WS received new connection');
        });
    }
}

new App()