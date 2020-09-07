import React from 'react'
import { HashRouter, Route, hashHistory } from 'react-router-dom'
import Login from '.components/Login'

export default(
    <HashRouter history = {hashHistory}>
        <div>
            <Route path ='/login' component={Login}/>
        </div>

    </HashRouter>
);