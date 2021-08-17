import React from "react"
import { Route, Switch, Redirect } from "react-router-dom"
import Home from "./containers/Home"
import Layout from "./hoc/Layout"

function App() {
    return (
        <Switch>
            <Route exact path="/" render={() => {
                return <Layout><Home /></Layout>
            }} />
        </Switch>
    )
}

export default App
