import grpc from "grpc";
import { loadSync } from "@grpc/proto-loader";
import path from 'path';

class Proto {
    constructor() {
        const packageDef = loadSync(path.resolve(__dirname, "sub.proto"), {});
        const grpcObject = grpc.loadPackageDefinition(packageDef);
        const subService = grpcObject.subService;
        this.client = new subService.ReceiveBusMessages(
            "localhost:4000",
            grpc.credentials.createInsecure()
        );
    }
}
const proto = new Proto();

export default proto;
export const Client = proto.client;