import { Router } from "express";
import { ClientDataStream } from './proto';

const routes = new Router();

routes.get('/', (req, res) => {
    return res.status(200).json({
        response: 'ok'
    });
});

// rota para chamar a funcao remota de inicio do stream de dados
routes.get('/startStream/:delay', (req, res) => {
    let { delay } = req.params;
    // o delay e valido apenas como inteiro
    delay = parseInt(delay);
    if (!delay || isNaN(delay)) return res.sendStatus(400);

    ClientDataStream.startDataStream({'delay': delay}, (err, response) => {
        console.log(err)
    });
    // nao vai retornar nenhum conteudo
    return res.sendStatus(204);
});

export default routes;
