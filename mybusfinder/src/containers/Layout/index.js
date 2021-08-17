import React, { useState } from "react";
import {
    Grid,
    Button, 
    AppBar, 
    Toolbar, 
    Typography,
    TextField,
} from "@material-ui/core";
import axios from 'axios';

const Layout = (props) => {
    const [delay, setDelay] = useState(100);

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Grid container>
                        <Grid item xs={10}>
                            <Typography variant="h6" style={{flexGrow: 1}}>
                                MyBusFinder
                            </Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <TextField 
                                label="Delay"
                                variant="outlined"
                                size="small"
                                type="number"
                                value={delay}
                                onChange={(event) => setDelay(event.target.value)}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <Button 
                                color="inherit" 
                                onClick={() => {
                                    axios.get(`http://localhost:3001/startStream/${delay}`).catch(e => {
                                        console.log(e)
                                    })
                                }}
                            > 
                                Start
                            </Button>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Grid 
                container 
                style={{
                    display: "grid", 
                    templateColumns: "1fr",
                    minHeight: "calc(100vh - 64px)",
                    alignItems: "center",
                    justifyItems: "center",
                    backgroundColor: "#8DD7CF" 
                }}
            >
            <Grid item style={{width: '100%'}}>{props.children}</Grid>
            </Grid>
        </>
    )
}

export default Layout