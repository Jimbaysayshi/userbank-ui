import React, { Component } from 'react'
import { Button, FormGroup, FormLabel, FormControl} from "react-bootstrap"
import { programs, credentials, remove, change } from './UserFunctions'


import "./Programs.css"


class ProgramsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            programList: [], //store initial list of programs and credentials
            makeChanges: false, //true if user wants to change existing credentials 
            program: '', 
            username: '',
            password:'',
            password_re:'',
            programChanges: []

        }
        this.getToken = this.getToken.bind(this) //get token from local storage
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.handleDeleteRow = this.handleDeleteRow.bind(this) //handler to delete a row
        this.handleChangeRow = this.handleChangeRow.bind(this)
    }

    removeRow(programName) {
        
        this.setState(prevState => {
            const programList = prevState.programList.filter(programList => programList.program !== programName)
            return { programList }
        })    

    }

    handleDeleteRow(programName) {
        remove(programName).then(res => {
            if(!res.err) {
                this.removeRow(programName)
                this.createTable()
            }               
        })
    }

    handleChangeRow(programID){
        const willChange = this.state.programList.find(({id}) =>  id === programID)
        this.setState({
            makeChanges: true,
            programChanges: willChange,
            program: '',
            username: '',
            password:'',
            password_re:'',

        }) 
    }

    inputValues(){
        if(this.state.makeChanges){
            const inputValues ={
                program: this.state.programChanges.program,
                username: this.state.programChanges.username,
                password: this.state.programChanges.password,   
                password_re: this.state.programChanges.password
            }
            return inputValues
            
        }else{
            const inputValues={
                program: this.state.program,
                username: this.state.username,
                password: this.state.password,
                password_re: this.state.password
            }         
            return inputValues
        }
    }

    createForm(){
        const inputValue = this.inputValues()
        console.log(this.state.program)
        console.log(inputValue)
        return <form noValidate onSubmit={this.onSubmit}>
                <FormGroup controlId="program" bsSize="large">
                    <FormLabel>Program</FormLabel>
                    <FormControl
                        type="program"
                        name="program"
                        defaultValue={ inputValue.program }
                        onChange={this.onChange}
                    />
                </FormGroup>
                <FormGroup controlId="username" bsSize="large">
                    <FormLabel>Username</FormLabel>
                    <FormControl
                        type="username"
                        name="username"
                        defaultValue={ inputValue.username }
                        onChange={this.onChange}
                    />
                </FormGroup>
                <FormGroup controlId="password" bsSize="large">
                    <FormLabel>Password</FormLabel>
                    <FormControl
                        type="password"
                        name="password"
                        defaultValue={ inputValue.password }
                        onChange={this.onChange}
                    />
                </FormGroup>
                <FormGroup controlId="password_re" bsSize="large">
                    <FormLabel>Password again</FormLabel>
                    <FormControl
                        type="password"
                        name="password_re"
                        defaultValue={ inputValue.password_re }
                        onChange={this.onChange}
                    />
                </FormGroup>
                <div className="button-group">
                    <Button className="register-btn" block bsSize="large" disabled={!this.validateForm()} type="submit">
                        Add program
                    </Button>
                </div>
            </form>        
    }

    createTable() {
        const { programList } = this.state
        if (programList.length === 0){
            return <p>Start by adding new credentials</p>
        }
        return <table>
            <tr>
                <th>Program</th>
                <th>Username</th>
                <th>Password</th>
                <th>Actions</th>
            </tr>
            
            {programList.map((item, i) => (
            
              <tr>
                <td key={i}>
                  <p>{item.program}</p>
                </td>
                <td key={i}>
                  <p>{item.username}</p>
                </td>
                <td key={i}>
                  <p>{item.password}</p>
                </td>
                <td>
                  <Button className="delete-btn" block bsSize="large" onClick={i => this.handleDeleteRow(item.program)}>
                  </Button>
                  <Button className="change-btn" block bsSize="large" onClick={e => this.handleChangeRow(item.id)}>
                  </Button>
                </td>
            </tr>
            
            ))}
        </table>
    }

    onChange(e){
        this.setState({[e.target.name]: e.target.value})
    }

    validateForm() {
        if('username' in this.state.programChanges){
            return true
        } else{
            if (this.state.username.length > 0 && this.state.password.length > 0 && this.state.password_re.length > 0){ 
                return this.state.password === this.state.password_re
            } 
        }      
    }

    onSubmit(e) {
        e.preventDefault()
               
        var newProgram = {
            program: this.state.program,
            username: this.state.username,
            password: this.state.password,           
            id: localStorage.id
        }

        if (newProgram.program === ''){
            newProgram.program = this.state.programChanges.program
        } 
        if (newProgram.username === ''){
            newProgram.username = this.state.programChanges.username
        } 
        if (newProgram.password === ''){
            newProgram.password = this.state.programChanges.password
        } 

        credentials(newProgram).then(res => {
            if(!res.err) {
                var newRow = {
                    program: newProgram.program,
                    username: newProgram.username,
                    password: newProgram.password,
                }
                this.setState({programList: this.state.programList.concat(newRow)})
                this.createTable()
            }               
        })
        console.log(this.state.program)
        console.log(this.state.programChanges)
        this.setState ({
            program: '',
            username: '',
            password:'',
            password_re:'',
            programChanges:[],
            makeChanges: false
        }, () => {        
            console.log(this.state.program)
            console.log(this.state.programChanges)
            })
        
    }
    
    getToken(){
        return localStorage.getItem('jwt-token')
    }

    componentDidMount() {
        const token = this.getToken()
        if(!token){
            this.props.history.push('/')
        }
        programs(token).then(res => {      
            if(!res.err) {
                this.setState({
                    programList: res.programs
                })  
            }
        }).catch(err =>{
            this.props.history.push('/')        
        })
    }

   
    render(){
        return (
        <div className="Programs">
            <h1>KEYBANK</h1>
            <div className="programtable">
                { this.createTable() }
            </div>
            <div className="addform">
                { this.createForm() }
            </div>
        </div>
        )
    }   
}

export default ProgramsList