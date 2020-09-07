import React, { Component } from 'react'
import { Button, FormGroup, FormLabel, FormControl} from "react-bootstrap"
import { login } from './UserFunctions'
import { Link } from 'react-router-dom'
import "./Login.css"

class LoginForm extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            masterkey :'',
            id: '',
            msg: "Login with an existing account or register a new one",
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    } 

    onChange(e){
        this.setState({[e.target.name]: e.target.value})
    }

    validateForm() {
        return this.state.username.length > 0 && this.state.masterkey.length > 0;
    }

    onSubmit(e) {
        e.preventDefault();
        const user = {
            username: this.state.username,
            masterkey: this.state.masterkey
        }
        login(user).then(res => {
            
            if(!res.data.err) {
                
                this.props.history.push('/programs')
            } else{
                this.setState({msg: res.data.err})
                
            }     
        })
    }

    alertMessage(){
        return this.state.msg
    }

    render(){
        return(
            <div className="Login">
                <div className="title2">
                    <h1>LOGIN</h1>
                </div>
                <form noValidate onSubmit={this.onSubmit}>
                    <FormGroup controlId="username" bsSize="large">
                        <FormLabel>Username</FormLabel>
                        <FormControl
                            type="username"
                            name="username"
                            value={this.state.username}
                            onChange={this.onChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="masterkey" bsSize="large">
                        <FormLabel>Masterkey</FormLabel>
                        <FormControl
                            type="password"
                            name="masterkey"
                            value={this.state.masterkey}
                            onChange={this.onChange}
                        />
                    </FormGroup>
                    <div className="button-group">
                        <Button className="login-btn" block bsSize="large" disabled={!this.validateForm()} type="submit">
                            Login
                        </Button>
                        or
                        <Link to="/register">
                            <Button className="register-btn" block bsSize="large">
                                Register
                            </Button>
                        </Link>
                    </div>
                </form>
                <div>
                    <p className="alert-msg">{this.alertMessage()}</p>
                </div>
            </div>
        );
    }

}
export default LoginForm;