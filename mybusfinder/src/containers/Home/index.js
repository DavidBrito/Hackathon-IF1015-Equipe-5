import React from "react"
import { Grid, TextField, Button, InputAdornment } from "@material-ui/core"
import { AccountCircle} from "@material-ui/icons"

const Home = () => {
    return (
        <Grid container spacing={4}>
            <Grid item xs={12} style={{
                textAlign: "center"
            }}>
                MYBUSFINDER
            </Grid>

            <Grid item xs={12} style={{
                textAlign: "center"
            }}>
                <TextField
                    id="input-with-icon-textfield"
                    label="Usuário"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AccountCircle />
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>

            <Grid item xs={12} style={{
                textAlign: "center"
            }}>
                <Button variant="contained" color="primary" size="large">Entrar</Button>
            </Grid>
        </Grid>
    )
}

export default Home