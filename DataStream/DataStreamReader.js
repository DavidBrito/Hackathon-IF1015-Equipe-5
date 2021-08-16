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
        var exchange = 'topic_transport';

        //logica para buscar os dados no csv
        channel.assertExchange(exchange, 'topic', {
            durable: false
        });

        // le o arquivo de dados e publica na fila de mensagens cada linha
        var dataReadStream = fs.createReadStream('data/bus_data_1.csv')
            .pipe(parseCSV({ delimiter: ',', from_line: 2, to_line: 1000, relax: true }))
            .on('data', async (row) => {
                try {
                    let busID = row[0]
                    let row_c = JSON.stringify(row)

                    dataReadStream.pause()
                
                    setTimeout(function () {
                        channel.publish(exchange, busID, Buffer.from(row_c));
                        console.log("Pub sent %s", row_c);
                        dataReadStream.resume()
                    }, 500);

                } catch (error) {
                    console.log(error)
                }
                
            }).on('end', () => {
                console.log("Dados CSV fim");
                connection.close();
                process.exit(0);
            });
    });
});
