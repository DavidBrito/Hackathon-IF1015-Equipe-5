#!/usr/bin/env node

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("proto/sub.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const busLocationService = grpcObject.busLocationService;

const client = new busLocationService.BusLocation("localhost:4000", 
grpc.credentials.createInsecure());

var call = client.consumeQueue({'busid': '1111'}, (err, response) => {
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