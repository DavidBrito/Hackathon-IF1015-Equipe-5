class WebSocket {
    constructor() {
        this.connection = new WebSocket('ws://localhost:3002/myapp');
        //programação dos eventos (assíncronos)
        connection.onopen = function () {
            //Envio de mensagens
            console.log('Connection Opened')
            // connection.send('1111');
        }
        
        connection.onclose = function () {
            console.log('Connection closed');
        }
        
        connection.onmessage = function (e) {
            const server_message = e.data;
            console.log(server_message);
        }
    }
}

const websocketInstance = new WebSocket();

export default websocketInstance;
export const connection = websocketInstance.connection;