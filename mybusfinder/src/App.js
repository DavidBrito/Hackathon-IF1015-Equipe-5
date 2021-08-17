import React from "react"
import { Route, Switch, Redirect } from "react-router-dom"
import Home from "./containers/Home"
import Layout from "./hoc/Layout"
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <>
        <Switch>
            <Route exact path="/" render={() => {
                return <Layout><Home /></Layout>
            }} />
        </Switch>
        <ToastContainer />
        </>
    )
}

export default App
