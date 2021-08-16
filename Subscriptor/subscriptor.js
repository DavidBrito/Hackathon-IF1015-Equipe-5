#!/usr/bin/env node
 
var amqp = require('amqplib/callback_api');
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("proto/sub.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const subService = grpcObject.subService;

const server = new grpc.Server();

server.bind("0.0.0.0:4000", grpc.ServerCredentials.createInsecure());

server.addService(subService.ReceiveBusMessages.service, {
    "connectToQueue": connectToQueue,
});


// Inicia conexão com a fila de mensagens

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var exchange = 'topic_transport';
 
    channel.assertExchange(exchange, 'topic', {
      durable: false
    });
 
    channel.assertQueue('', {
      durable: false
    }, function(error2, q) {
      if (error2) {
        throw error2;
      }
      console.log("Waiting for message")

      channel.bindQueue(q.queue, exchange, '12111'); //input de teste

      channel.consume(q.queue, function(msg) {
        if(msg.content) {
          //a queue recebeu uma mensagem
          console.log(msg.content.toString());
          }
      }, {
        noAck: true
      });

    });
  });
});

server.start()


function connectToQueue(call, callback) {
    // abrir uma stream entre a api e as mesagens
    callback(null, {"businfo": call.request.queuename})
    // channel.consume('test', function(msg) {
    //   if(msg.content) {
    //       callback(null, {'businfo': msg.content.toString()});
    //     }
    // }, {
    //   noAck: true
    // });
}

