#!/usr/bin/env node

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("proto/mybusfinder.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const myBusFinder = grpcObject.myBusFinder;

const client = new myBusFinder.BusLocation("localhost:4000", 
grpc.credentials.createInsecure());

// testar com 12113, 12452
var call = client.consumeQueue({'busid': '12113'}, (err, response) => {
    console.log(err)

});

 call.on('data', (msg) => {
     console.log(msg);
 });
  
call.on('end', function() {
    console.log('Finished')
});
  
call.on('error', function(e) {
    console.log('Error: ' + e)  
});
  
call.on('status', (status) => {
    console.log(status)
});