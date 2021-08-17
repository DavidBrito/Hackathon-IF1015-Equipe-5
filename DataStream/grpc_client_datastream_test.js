#!/usr/bin/env node

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("proto/mybusfinder.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const myBusFinder = grpcObject.myBusFinder;

const client = new myBusFinder.DataStream("localhost:4001", 
grpc.credentials.createInsecure());

client.startDataStream({'delay': 200}, (err, response) => {
    console.log(err)
});