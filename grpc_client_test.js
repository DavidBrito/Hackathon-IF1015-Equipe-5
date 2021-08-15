const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("Processor/sub.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const subService = grpcObject.subService;

const client = new subService.ReceiveBusMessages("localhost:4000", 
grpc.credentials.createInsecure());

client.connectToQueue({'queuename': 'hello'}, (err, response) => {
     
 });