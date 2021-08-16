import { Router } from "express";
import { Client } from './proto';

const routes = new Router();

// Middlewares
// routes.use((req, _, next) => {
//     console.log(`Passou pelo middleware`);
//     return next();
// });

routes.get('/', (req, res) => {
    return res.status(200).json({
        response: 'ok'
    });
});

routes.get('/hello', (req, res) => {
    return Client.connectToQueue({'queuename': 'hello'}, (err, response) => {
        return res.status(200).json({
            response
        });
    });
});





export default routes;