#!/usr/bin/env node

const amqp = require('amqplib/callback_api');
const fs = require('fs');
const parseCSV = require('csv-parse');

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

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
        var dataReadStream = fs.createReadStream('data/bus_data_1.csv')
            .pipe(parseCSV({ delimiter: ',', from_line: 2, to_line: 1000, relax: true }))
            .on('data', async (row) => {
                //let busID = row[2]
                // console.log(busID)
                try {
                    console.log(row)
                    dataReadStream.pause()

                    setTimeout(function () {
                        //${row[0]}-${row[1]}-${row[2]}
                        channel.sendToQueue('test', Buffer.from(JSON.stringify(row)));
                        console.log("Pub sent %s", JSON.stringify(row));
                        dataReadStream.resume()
                    }, 1000);

                } catch (error) {
                    console.log(error)
                }
                // TODO: Esse comando é uma fila para cada busID?? **
                // channel.publish(exchange, busID, Buffer.from(busData));
            }).on('end', () => {
                console.log("Dados CSV fim");
                connection.close();
                process.exit(0);
            });
    });
});

