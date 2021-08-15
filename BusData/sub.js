#!/usr/bin/env node
 
var amqp = require('amqplib/callback_api');
 
amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var exchange = 'transport';
 
    channel.assertExchange(exchange, 'direct', {
      durable: false
    });
 
    channel.assertQueue('test', {
      exclusive: true
    }, function(error2, q) {
      if (error2) {
        throw error2;
      }
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
      //channel.bindQueue(q.queue, exchange, '');
 
      channel.consume('test', function(msg) {
        if(msg.content) {
            console.log(" [x] %s", msg.content.toString());
          }
      }, {
        noAck: true
      });
    });
  });
});