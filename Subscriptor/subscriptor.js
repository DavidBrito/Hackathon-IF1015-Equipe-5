#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("proto/sub.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const busLocationService = grpcObject.busLocationService;

const server = new grpc.Server();

server.bind("0.0.0.0:4000", grpc.ServerCredentials.createInsecure());

server.addService(busLocationService.BusLocation.service, {
  "consumeQueue": consumeQueue,
});

console.log("Waiting for client...")

server.start()

function consumeQueue(call, callback) {


  amqp.connect('amqp://localhost', (error0, conn) => {
    if (error0) {
      throw error0;
    }

    conn.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }

      var exchange = 'topic_transport';

      channel.assertExchange(exchange, 'topic', { durable: false });

      channel.assertQueue('', { durable: false }, function (error2, q) {
        if (error2) {
          throw error2;
        }

        console.log("Running...")

        channel.bindQueue(q.queue, exchange, call.request.busid);

        channel.consume(q.queue, function (msg) {
          if (msg.content) {
            //a queue recebeu uma mensagem
            call.write({ 'businfo': msg.content.toString() });
          }
        }, {
          noAck: true
        });

        console.log("End...")

      });

    });
  });
}

