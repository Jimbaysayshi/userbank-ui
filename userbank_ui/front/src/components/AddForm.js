import React, { Component } from 'react'
import { Button, FormGroup, FormLabel, FormControl} from "react-bootstrap"
import { credentials } from './UserFunctions'


import "./Programs.css"


export class AddCredentialForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            programList: [],
            program: '',
            username: '',
            password:'',
            password_re:'',
            alertMessage:'',

        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

    }
    onChange(e){
        this.setState({[e.target.name]: e.target.value})
    }

    validateForm() {
        if (this.state.username.length > 0 && this.state.password.length > 0 && this.state.password_re.length > 0){ 
            this.setState({alertMessage: ''})
            return this.state.password === this.state.password_re
        }
        else {
            this.setState({alertMessage: "Enter valid credentials"})
        }     
    }

    onSubmit(e) {
        e.preventDefault();
        const newProgram = {
            program: this.state.program,
            username: this.state.username,
            password: this.state.password,
            id: localStorage.id
        }
        credentials(newProgram).then(res => {
            if(!res.err) {
                var newRow = {
                    program: newProgram.program,
                    username: newProgram.username,
                    password: newProgram.password,
                }
                
                this.setState({programList: this.state.programList.concat(newRow)})
                //this.createTable()
            }               
        })
        this.setState ({
            program: '',
            username: '',
            password:'',
            password_re:'',
        })
    }
    componentDidMount(){
    
        console.log(this.props.willPrefill)
        if(this.props.willPrefill){
            const data = this.props.willPrefill
            this.setState({
                program: data.program,
                username: data.username,
                password: data.password,
                password_re: data.password_re,
            })
        }
    }
    

    render(){
        return(
            <form noValidate onSubmit={this.onSubmit}>
                <FormGroup controlId="program" bsSize="large">
                    <FormLabel>Program</FormLabel>
                    <FormControl
                        type="program"
                        name="program"
                        value={this.state.program}
                        onChange={this.onChange}
                    />
                </FormGroup>
                <FormGroup controlId="username" bsSize="large">
                    <FormLabel>Username</FormLabel>
                    <FormControl
                        type="username"
                        name="username"
                        value={this.state.username}
                        onChange={this.onChange}
                    />
                </FormGroup>
                <FormGroup controlId="password" bsSize="large">
                    <FormLabel>Password</FormLabel>
                    <FormControl
                        type="password"
                        name="password"
                        value={this.state.password}
                        onChange={this.onChange}
                    />
                </FormGroup>
                <FormGroup controlId="password_re" bsSize="large">
                    <FormLabel>Password again</FormLabel>
                    <FormControl
                        type="password"
                        name="password_re"
                        value={this.state.password_re}
                        onChange={this.onChange}
                    />
                </FormGroup>
                <div className="button-group">
                    <Button className="register-btn" block bsSize="large" disabled={!this.validateForm()} type="submit">
                        Add program
                    </Button>
                </div>
            </form>
        )}
    }

