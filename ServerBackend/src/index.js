import express from "express"
import cors from "cors"
import routes from "./routes"
import './proto';

class App {
    port = 3001
    constructor () {
        this.server = express()
        this.server.use(cors());
        this.server.use(express.json())
        this.server.use(routes)
        this.server.listen(this.port, (port) => {
            console.log(`Listening at port ${this.port}`)
        })
    }
}

new App()