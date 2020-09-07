import React, { Component } from 'react'
import { Button, FormGroup, FormLabel, FormControl} from "react-bootstrap"
import { register } from './UserFunctions'
import { Link } from 'react-router-dom'
import "./Register.css"

class RegisterForm extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            masterkey:'',
            masterkey_re:'',
            msg: '',
            errMsg: '',
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange(e){
        this.setState({[e.target.name]: e.target.value})
        this.setState({errMsg: ''})
    }

    validateForm() {
        if (this.state.username.length > 0 && this.state.masterkey.length > 0 && this.state.masterkey_re.length > 0){ 
            return this.state.masterkey === this.state.masterkey_re
        }          
    }

    onSubmit(e) {
        e.preventDefault();
        const newUser = {
            username: this.state.username,
            masterkey: this.state.masterkey
        }
        register(newUser).then(res => {
            if(!res.data.err) {

                this.props.history.push('/')
            }
            else{
                console.log(res.data.err)
                this.setState({errMsg: res.data.err})
            }               
        })
    }

    alertMessage(){
        let msg = ''

        if (this.state.errMsg !== ''){
            msg = this.state.errMsg
        } else if (this.state.username.length === 0){
            msg = "Enter your username"
        } else if (this.state.masterkey.length === 0){
            msg = "Enter your masterkey"
        } else if (this.state.masterkey_re.length === 0){
            msg = "Enter your masterkey again"
            
        } else if (this.state.masterkey !== this.state.masterkey_re){
            msg = "Passwords has to match"
        } else {
            msg = "Good job! We are ready to register your account"
        }
        return msg
    }

    render(){
        return(
            <div className="Register">
                <div className="title2">
                    <h1>REGISTER</h1>
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
                    <FormGroup controlId="masterkey_re" bsSize="large">
                        <FormLabel>Masterkey again</FormLabel>
                        <FormControl
                            type="password"
                            name="masterkey_re"
                            value={this.state.masterkey_re}
                            onChange={this.onChange}
                        />
                    </FormGroup>
                    <div className="button-group">
                        <Link to="/">
                            <Button className="login-btn" block bsSize="large">
                                Login
                            </Button>
                        </Link>
                        or
                        <Button className="register-btn" block bsSize="large" disabled={!this.validateForm()} type="submit">
                            Register
                        </Button>
                    </div>
                </form>
                <div>
                    <p className="alert-msg">{this.alertMessage()}</p>
                    
                </div>
            </div>
        );
    }

}
export default RegisterForm;