import React, { useState, useEffect, useRef } from "react"
import { 
    Grid, 
    TextField, 
    Button, 
} from "@material-ui/core"
import {
    Autocomplete,
} from "@material-ui/lab"
//Leaflet
import L from 'leaflet';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import getDistance from 'geolib/es/getDistance';

const Home = () => {
    // estado, funcao que altera o estado - valor inicial em 0
    const [ map, setMap ] = useState();
    const [ selectedBus, setSelectedBus ] = useState('1111');
    const [ connection, setConnection ] = useState();
    const [ userPosition, setUserPosition] = useState();

    const [ markers, setMarkers ] = useState();
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

        const layerGroup = L.layerGroup().addTo(map);
        const userPos = L.marker(position).addTo(map);
        const userCircle = L.circle(position, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 3000
        }).addTo(map);
        // marcacao no mapa
        setMarkers(layerGroup);
        setMap(map);

        setUserPosition(userPos)

        // Antes do userEffect renderizar aplica a funcao setMap(null) para nao ficar um mapa em cima do outro.
        return () => {
            setMap(null);
        }
    }, [setMap])

    // atualiza os marcados do mapa
    const latestMap = useRef(null);
    latestMap.current = map;
    useEffect(() => {
        if (connection) {
            connection.onmessage = (e) => {
                const serverMessage = JSON.parse(e.data);
                // ["1111","Empresa_13","1111","2017-12-01 06:56:05.360","1","1","286993","9110756","NULL","NULL","NULL","NULL","NULL"]

                if (["NULL", "TESTE", "0"].includes(serverMessage[6]) || ["NULL", "TESTE", "0"].includes(serverMessage[7])) return;

                const item = L.utm({x: serverMessage[6], y: serverMessage[7], zone: 25, southHemi: true});
                const coord = item.latLng();

                console.log("Calculating distance");

                const geoDistance = new Observable(subscriber => {
                    subscriber.next(
                        getDistance(
                            { latitude: -8.0532143, longitude: -34.923340 },
                            { latitude: coord.lat, longitude: coord.lng })
                    )
                }).pipe(filter(x => x < 3000));
                geoDistance.subscribe(x => {
                  console.log("Seu ônibus está à" + x/1000 + "km de distância");
                });

                setMarkers((prevMarkers) => {
                    if (prevMarkers) {
                        prevMarkers.clearLayers();
                    }
                    const marker = L.marker([coord.lat, coord.lng]).addTo(prevMarkers);
                    return prevMarkers;
                });
            }
            return () => connection.close();
        }
    }, [connection, setMarkers]);

    const handleFindBus = () => {
        const newConnection = new WebSocket('ws://localhost:3002/myapp');
        //programação dos eventos (assíncronos)
        newConnection.onopen = () => {
            console.log('Connection Opened');
            newConnection.send(selectedBus)
        }
        newConnection.onclose = () => console.log('Connection closed');
        setConnection(newConnection);
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
                                setSelectedBus(newValue);
                            }}
                            options={[
                                '1111',
                                '3333',
                                '12049',
                                '12452',
                                '12113',
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
                            onClick={handleFindBus}
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