import React, { Component } from 'react'
import './App.css';
import { Route, HashRouter} from 'react-router-dom'
import Login  from './components/Login';
import Register  from './components/Register';
import Programs from './components/Programs';

class App extends Component {
    render() {
        return (
            <HashRouter>
                <div className="App">
                    <h3 style={{color: "red"}}>THIS APPLICATION IS FOR TESTING PURPOSES ONLY</h3>
                    <h3 style={{color: "red"}}>DO NOT SUBMIT YOUR REAL CREDENTIALS</h3>
                    <Route exact path="/" component={Login}/>
                    <Route path="/register" component={Register}/>
                    <Route path="/programs" component={Programs}/>
                    
                </div>
            </HashRouter>
        );
    }
}
export default App;
