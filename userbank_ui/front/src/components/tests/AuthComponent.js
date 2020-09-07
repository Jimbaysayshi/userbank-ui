import React, { Component } from 'react';
import { auth, jwtToken } from './AuthFunctions';
import { WithRouter } from 'react-router-dom';

class AuthComponent extends Component {
    constructor(props){
        super(props);

        this.state = {
            access = false
        };
    }

    componentDidMount(){
        const jwt = jwtToken();
        
    }
}