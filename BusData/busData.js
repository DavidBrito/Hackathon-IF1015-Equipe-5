const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("pub.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const pubService = grpcObject.pubService;

const server = new grpc.Server();

server.bind("0.0.0.0:4000", grpc.ServerCredentials.createInsecure());

server.addService(pubService.Calculadora.service, {
    "calcular": calcular,
});

server.start()

function calcular(call, callback) {
    console.log(JSON.stringify(call.request))
    operando1 = call.request.operando1
    operando2 = call.request.operando2
    operacao = call.request.operacao
    
    result = {}
    switch (operacao) {
        case 1:
            result['resultado'] = operando1 + operando2;
            break;
        case 2:
            result['resultado'] = operando1 - operando2;
            break;
        case 3:
            result['resultado'] = operando1 * operando2;
            break;
        case 4:
            result['resultado'] = operando1 / operando2;
            break;
        default:
            break;
    } 
    console.log(result)
    callback(null, result)
}