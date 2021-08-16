import React from "react"
import {
    Grid,
    Button, 
    InputAdornment, 
    AppBar, 
    Toolbar, 
    IconButton, 
    Typography 
} from "@material-ui/core"
import { Menu as MenuIcon} from "@material-ui/icons"

const Layout = (props) => {
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{flexGrow: 1}}>
                        MyBusFinder
                    </Typography>
                    <Button color="inherit">Config</Button>
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