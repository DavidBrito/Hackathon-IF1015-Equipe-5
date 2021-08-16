import React from "react"
import {Grid} from "@material-ui/core"

const Layout = (props) => {
    return (
        <Grid container style={{display: "grid", 
        templateColumns: "1fr",
        minHeight: "100vh",
        alignItems: "center",
        justifyItems: "center",
        backgroundColor: "#8DD7CF" }}>
           <Grid item>{props.children}</Grid>
        </Grid>
    )
}

export default Layout