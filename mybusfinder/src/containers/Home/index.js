import React, { useState, useEffect, useRef } from "react"

// Framework material ui
import { Grid, TextField, Button } from "@material-ui/core"
import { Autocomplete } from "@material-ui/lab"

//Leaflet
import L from 'leaflet';

// pagina principal
const Home = () => {
    // Hooks de estado, funcao que altera o estado
    const [ map, setMap ] = useState();
    const [ selectedBus, setSelectedBus ] = useState('12113');
    const [ connection, setConnection ] = useState();
    const [ markers, setMarkers ] = useState();

    // Executa funcao que renderiza o mapa apenas uma vez qnd entra na Home
    useEffect(() => {
        // posicao inicial do mapa Recife
        const position = Object.values({ lat: -8.0532143, lng: -34.923340 });

        // Inicializa a instância do Mapa com id busMap em recife e zoom 13
        const map = L.map('busMap', {
            minZoom: 4,
            preferCanvas: true,
        }).setView(position, 13);

        // adiciona os tiles do OpenStreetmap 
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    
        // grupo de layers para agrupar os marcadores inseridos no mapa
        const layerGroup = L.layerGroup().addTo(map);
        
        // altera o estado: map e markers
        setMarkers(layerGroup);
        setMap(map);

        // Antes do userEffect renderizar aplica a funcao setMap(null) para nao ficar um mapa em cima do outro.
        return () => {
            setMap(null);
        }
    }, [setMap])

    // atualiza os marcadores do mapa
    const latestMap = useRef(null);
    latestMap.current = map;

    // Executa sempre que houver a renderizacao de um componente
    useEffect(() => {
        if (connection) {
            // Se existir o estado connection ouve websocket e recebe dados da stream
            connection.onmessage = (e) => {
                const serverMessage = JSON.parse(e.data);
                // ["1111","Empresa_13","1111","2017-12-01 06:56:05.360","1","1","286993","9110756","NULL","NULL","NULL","NULL","NULL"]
                
                // filtra as mensagens com valores indesejados
                if (["NULL", "TESTE", "0"].includes(serverMessage[6]) || ["NULL", "TESTE", "0"].includes(serverMessage[7])) return;

                // aplica funcao do plugin latlng.UTM
                const item = L.utm({x: serverMessage[6], y: serverMessage[7], zone: 25, southHemi: true});
                
                // recebe coordenada latitude longitude
                const coord = item.latLng();

                // se existirem marcadores no mapa limpa todos os layers. Evita que marcadores fiquem no mapa
                setMarkers((prevMarkers) => {
                    if (prevMarkers) {
                        prevMarkers.clearLayers();
                    }
                    // adiciona marcador na lat e lng
                    const marker = L.marker([coord.lat, coord.lng]).addTo(prevMarkers);
                    return prevMarkers;
                });
            }
            return () => connection.close();
        }
    }, [connection, setMarkers]);

    // funcao inicia conexao com websocket e define estado connection com o ws que foi aberto
    const handleFindBus = () => {
        const newConnection = new WebSocket('ws://localhost:3002/myapp');

        newConnection.onopen = () => {
            console.log('Connection WS server opened');
            newConnection.send(selectedBus)
        }

        newConnection.onclose = () => {
            console.log('Connection WS server closed');
        }
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
                                '12113',
                                '12049',
                                '12452',
                                '12111',
                                '12152'
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