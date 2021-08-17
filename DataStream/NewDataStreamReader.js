#!/usr/bin/env node

// TODO: achar alternativa para fecha stream do csv-parse na funcao
// enquanto isso usar o DataStreamReader.js

const amqp = require('amqplib/callback_api');
const fs = require('fs');
const parseCSV = require('csv-parse');
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("proto/mybusfinder.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const myBusFinder = grpcObject.myBusFinder;

const server = new grpc.Server();

server.bind("0.0.0.0:4001", grpc.ServerCredentials.createInsecure());

server.addService(myBusFinder.DataStream.service, {
    "startDataStream": startDataStream,
});

console.log("Waiting command...")


server.start()

function startDataStream(call, callback) {

    console.log("startDataStream Iniciado...")

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
            var dataReadStream = fs.createReadStream('data/bus_data_1_ord.csv')
                .pipe(parseCSV({ delimiter: ',', from_line: 2, to_line: 1000, relax: true }))
                .on('data', (row) => {
                    try {
                        let busID = row[0]
                        let row_c = JSON.stringify(row)
                        // pausa a leitura do csv e volta dps do delay
                        dataReadStream.pause()
                        setTimeout(function () {
                            channel.publish(exchange, busID, Buffer.from(row_c));
                            console.log(row_c);
                            dataReadStream.resume()
                        }, call.request.delay || 100);
                        
                    } catch (error) {
                        console.log(error)
                    }

                }).on('end', () => {
                    console.log("Dados CSV fim");
                    //connection.close();
                });
        });
    });
}