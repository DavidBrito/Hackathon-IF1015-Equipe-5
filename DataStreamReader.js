#!/usr/bin/env node

const amqp = require('amqplib/callback_api');
const fs = require('fs');
const parseCSV = require('csv-parse');

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
        channel.assertExchange(exchange, 'direct', {
            durable: false
        });
        
        // le o arquivo de dados e publica na fila de mensagens cada linha
        fs.createReadStream('data/bus_data_1.csv')
            .pipe(parseCSV({ delimiter: ',', from_line: 2, to_line: 10000, relax: true }))
            .on('data', (row) => {
                let busID = row[2]
                console.log(busID)

                // TODO: Esse comando é uma fila para cada busID?? **
                // channel.publish(exchange, busID, Buffer.from(busData));

                channel.sendToQueue('test', Buffer.from(JSON.stringify(row)));
                console.log("Pub sent %s", JSON.stringify(row));

            // TODO: sleep function 10s
        });
    });


    setTimeout(function () {
        connection.close();
        process.exit(0);
    }, 500);
});

