import React, { useState, useEffect } from "react"
import { 
    Grid, 
    TextField, 
    Button, 
    InputAdornment, 
} from "@material-ui/core"
import {
    Autocomplete,
} from "@material-ui/lab"
import { AccountCircle} from "@material-ui/icons"
import '../../utils/grpcClient';

//Leaflet
import L from 'leaflet';

const Home = () => {
//     // estado, funcao que altera o estado - valor inicial em 0
//     const [currentPage, setCurrentPage] = useState(0);

//     console.log(currentPage)
//     // funcao setCurrentPage vai alterar o estado do componente pai
//     const pages = [
//         <Login setCurrentPage={setCurrentPage} />,
//         <Mapa setCurrentPage={setCurrentPage} />
//     ];

    const [ map, setMap ] = useState();
    const [ selectedBus, setSelectedBus ] = useState('1111');
    // permite controlar as renderizacoes do componente, sempre que renderizar chama useEffect()
    // se o mapa alterar useEffect vai ser acionado.
    useEffect(() => {
        // posicao inicial do mapa Recife
        const position = Object.values({ lat: -8.0532143, lng: -34.923340 });

        // Inicializa a instância do Mapa em position e zoom 13
        const map = L.map('busMap', {
            minZoom: 4,
            preferCanvas: true,
        }).setView(position, 13);

        // adiciona os tiles do OpenStreetmap 
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        setMap(map);


        // Antes do userEffect renderizar aplica a funcao setMap(null) para nao ficar um mapa em cima do outro.
        return () => {
            setMap(null);
        }
    }, [setMap])

    // funcao abre a conexao grpc com a fila de mensagens vindas do subscriptor
    const handleBusLocation = (bus) => {
        setSelectedBus(bus);

        // const call = client.consumeQueue({ 'busid': '1111' }, (err, response) => {
        //     console.log(err)
        // });

        // call.on('data', (msg) => {
        //     console.log(msg);
        // });

        // call.on('end', function () {
        //     console.log('Finished')
        // });

        // call.on('error', function (e) {
        //     console.log('Error: ' + e)
        // });

        // call.on('status', (status) => {
        //     console.log(status)
        // });
    }

    return (
        <Grid container>
            <Grid item xs={12} style={{
                textAlign: "center"
            }}>
                <Grid container>
                    <Grid item xs={4} />
                    <Grid item xs={2}>
                        <Autocomplete
                            value={selectedBus}
                            onChange={(event, newValue) => {
                                handleBusLocation(newValue)
                            }}
                            options={[
                                '1111',
                                '2222',
                            ]}
                            renderInput={(params) => 
                                <TextField 
                                    {...params} 
                                    label="Número do ônibus" 
                                    variant="outlined" 
                                    style={{marginBottom: '2%'}} 
                                />
                            }
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <Button 
                            size="large"
                            variant="contained" 
                            onClick={() => console.log('ok')}
                        >
                            Consultar
                        </Button>
                    </Grid>
                    <Grid item xs={4} />
                </Grid>

            </Grid>

            <Grid item xs={1}/>
            <Grid item xs={10}>
                <div style={{height: '70vh', width: '100%'}} id="busMap" />
            </Grid>
        </Grid>
    )
}

export default Home