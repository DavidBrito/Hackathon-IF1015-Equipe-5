import grpc from "grpc";
import { loadSync } from "@grpc/proto-loader";
import path from 'path';

class Proto {
    constructor() {
        const packageDef = loadSync(path.resolve(__dirname, "mybusfinder.proto"), {});
        const grpcObject = grpc.loadPackageDefinition(packageDef);
        const myBusFinder = grpcObject.myBusFinder;

        this.clientBusLocation = new myBusFinder.BusLocation(
            "localhost:4000",
            grpc.credentials.createInsecure()
        );

        this.clientDataStream = new myBusFinder.DataStream(
            "localhost:4001", 
            grpc.credentials.createInsecure()
        );
    }
}
const proto = new Proto();

export default proto;
export const ClientBusLocation = proto.clientBusLocation;
export const ClientDataStream = proto.clientDataStream;