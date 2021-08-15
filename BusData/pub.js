#!/usr/bin / env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        var exchange = 'transport';

        //logica para buscar os dados no csv
        var busData

        channel.assertExchange(exchange, 'direct', {
            durable: false
        });
        //loop para cada linha do csv => 
        {
            const busID = busData //.(retornar o valor da coluna 'matricula' dessa linha)

            channel.publish(exchange, busID, Buffer.from(busData));
            console.log(" [x] Sent %s", busData);
        }
    });

    setTimeout(function () {
        connection.close();
        process.exit(0);
    }, 500);
});

