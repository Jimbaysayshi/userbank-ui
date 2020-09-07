import React, { Component } from 'react'
import { Button } from "react-bootstrap"
import { programs, credentials, remove, change, logout } from './UserFunctions'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Cookie } from 'js-cookie'

import "./Programs.css"

class ProgramsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            programList: [], //store initial list of programs and credentials
            makeChanges: false, //true if user wants to change existing credentials 
            formState: {
                alertMessage: '',
                idx: '',
                program: '', 
                username: '',
                password:'',
                password_re:'',
                mode: "submit",
            }
        }
        this.getToken = this.getToken.bind(this) //get token from local storage

    }

    resetFormState = () => {
        this.setState({
            formState:{
                alertMessage: '',
                program: '',
                username: '',
                password: '',
                password_re: '',
                mode: "submit",
                idx: ''
            }
        })
    }
    
    onChange = e => {
        this.setState({
            formState:{
                ...this.state.formState,
            
                [e.target.name]: e.target.value
            }
        })
    }

    onSubmit = e => {
        const { programList, formState } = this.state
        e.preventDefault()
        const program = e.target.querySelector("input[name='program']").value      
        const username = e.target.querySelector("input[name='username']").value      
        const password = e.target.querySelector("input[name='password']").value      
        const password_re = e.target.querySelector("input[name='password_re']").value
        let index = 0
        if(formState.mode === "submit"){
            if(programList.length !== 0){
                const len = this.state.programList.length
                index = this.state.programList[len-1].idx +1

            }
            const credentialSet = {
                program: program,
                username: username,
                password: password,
                index: index
            } 
            this.addCredentials(credentialSet)
            this.setState({
                programList: [
                    ...this.state.programList,
                    {
                        program,
                        username,
                        password,
                        password_re,
                        updating: false,
                        idx: index
                    }
                ]
            })
                

        
        } else if (formState.mode === "edit"){

            var idx = programList.find((item) => item.idx === formState.idx).idx
            index = programList.findIndex(p => p.idx === idx)

            programList[index] = {
                program,
                username,
                password,
                updating: false,
                idx:idx
                //idx:programList[index].idx
            }

                        
            const credentialSet = {
                program: program,
                username: username,
                password: password,
                index: programList[index].idx
            } 
            this.addCredentials(credentialSet)
            this.setState({
                programList: [...programList]
            })    
        }
    }

    addCredentials(credentialSet){
        const { formState } = this.state

        if (formState.mode === 'submit'){
            
            credentials(credentialSet)
            .then(res => {
                this.authorizationCheck(res)
                if(!res.err){
                    this.resetFormState()
                }
            })
            .catch(err => {
                console.log(err)
            })
        } else if (formState.mode === 'edit'){
            change(credentialSet)
            .then(res => {
                this.authorizationCheck(res)
                if(!res.err){
                    this.resetFormState()
                }
            })
            .catch(err => {
                this.props.history.push('/')
                console.log(err)
            })
        }
    }

    updateCredentials = key => {
        
        let { programList } = this.state

        let credentials = programList.find((item) => {
            return item.idx === key
        })

        credentials.updating = true
        this.setState({
            formState: { ...credentials, mode: "edit"},
            programList
        })
        //programList[key].updating = true 
        //this.setState({
        //    formState: { ...this.state.programList[key], mode: "edit"},
        //    programList
        //})
    }

    deleteCredentials = key => {

        var programList = [...this.state.programList]
        var removed = programList.splice(key, 1)

        const removeProgram = {
            program: removed[0].program,
            username: removed[0].username,
        }
        remove(removeProgram).then(res => {
            if(!res.err){
                this.setState({
                    programList: [...programList]
                })
            }
        }).catch(err => {
            this.props.history.push('/')
        })

    }
   
    getToken(){
        return localStorage.getItem('jwt-token')
    }

    validateForm(formState){
        if (formState.program.length > 0 && formState.username.length > 0 && formState.password.length > 0) {

            return formState.password === formState.password_re
        }
        return false
    }


    componentDidMount() {
        const token = this.getToken()
        programs(token).then(res => {
            this.authorizationCheck(res)      
            if(!res.err) {
                this.setState({
                    programList: res.data.programs
                })  
            }
        }).catch(error =>{
            console.log(error.response.data)
            this.props.history.push('/')        
        })
    }

    logOut(responseData){
        if (responseData){

            Cookie.remove('token')
            localStorage.removeItem('jwt-token')
            return this.props.history.push({
                pathname: '/',
                state: responseData.data.msg
            }) 
        }
        else {
            return this.props.history.push('/')
            
        }
    }
    

    authorizationCheck = responseData => {
        switch (responseData.status){
            case 401: 
                return this.logOut(responseData)
            case 500:
                return this.logOut(responseData)
            case 422:
                return this.logOut(responseData)
            default:
                return {}
        }
        
    }
    
    titleChange(){
        let { formState } = this.state
        let title = 'Add'

        if (formState.mode === 'edit'){
            title = 'Edit'
        } 
        return title
    }

    alertMessage(){
        
        let { formState } = this.state

        if (formState.program.length === 0){
            return 'Enter application name'
        } else if(formState.username.length === 0) {
            return 'Enter your username for the application'
        } else if(formState.password.length === 0){
            return 'Enter your password for the application'
        } else if(formState.password_re === ''){
            if(formState.password_re.length === 0){
                return 'Enter your password again'
        } 
        } else if (formState.password !== formState.password_re){
            return 'Passwords has to match'
        } else if (formState.password.length < 8) {
            return 'Recommended password length is 8 digits'
        } else if (formState.mode === 'submit') {
            return 'Good job! Now you can submit your credentials'
        } else {
            return "Save your credentials by clicking 'edit'"
        }
        
        
    }

   
    render(){
        const { programList, formState } = this.state
        return (

            <div className="Programs">
                <div className="top-row">

                    <div className="logout">
                        <Button className="logout-btn" onClick={() => this.logOut()}>
                            Logout
                        </Button>
                    </div>
                </div>
                <h1 className="title">KEYBANK</h1>
                <div className="programtable">
                    <Table
                        programList={programList}
                        updateCredentials={this.updateCredentials}
                        deleteCredentials={this.deleteCredentials}
                    />
                </div>
                <div className="addform">
                    <h3 className="form-title"> {this.titleChange()} credentials</h3>
                    <Form
                        formState={formState}
                        onChange={this.onChange}
                        onSubmit={this.onSubmit}
                        validateForm={this.validateForm}
                        resetFormState={this.resetFormState}
                    />
                    <p className="alert-msg">{this.alertMessage()}</p>
                </div>
            </div>
        )
    }   
}
const Table =({ programList=[], updateCredentials, deleteCredentials }) =>{
    if (!programList.length > 0){
        return <p>Start by adding new credentials</p>
    }
    return(
        <table>
            <tr>
                <th>Application</th>
                <th>Username</th>
                <th>Password</th>
                <th>Actions</th>
            </tr>
            
            {programList.map((item) => {
                
                return (            
                <tr>
                    <td>
                        <p>{item.program}</p>
                    </td>
                    <td>
                        <p>{item.username}</p>
                    </td>
                    <td >
                        <p>****</p>
                    </td>
                    <td className="btn-col">
                        <CopyToClipboard text={item.password} >
                            <Button className="table-btn">
                                copy
                            </Button>
                        </CopyToClipboard>
                        <Button className="table-btn"  onClick={() => updateCredentials(item.idx)}>
                            edit
                        </Button>
                        <Button className="table-btn"  onClick={() => deleteCredentials(item.idx)}>
                            del
                        </Button>
                    </td>
                </tr>
                )
            })}
    </table>
    )
}

const Field = ({label ="", name="", value="", type="", onChange}) =>{
        return(<div className="field-set">
            <label className="field-label" htmlFor={name}>{label}</label>
            <input className="field-input" type={type} name={name} value={value} onChange={onChange}/>
        </div>
        )}

const Form = ({ formState, onChange, onSubmit, validateForm, resetFormState }) => {
    

    return (

            <form className="form" onSubmit={onSubmit}>
                <fieldset>
                    <Field 
                        name="program"
                        label="Application"
                        type="text"
                        value={formState.program}
                        onChange={onChange}
                    />
                    <Field 
                        name="username"
                        label="Username"
                        type="text"
                        value={formState.username}
                        onChange={onChange}
                    />
                    <Field 
                        name="password"
                        label="Password"
                        type="password"
                        value={formState.password}
                        onChange={onChange}
                    />
                    <Field
                        name="password_re"
                        label="Password again"
                        type="password"
                        value={formState.password_re}
                        onChange={onChange}
                    />
                </fieldset>

                <div className="button-group">
                    <Button className="form-btn" type={formState.mode} disabled={!validateForm(formState)}>
                        {formState.mode}
                    </Button>
                    <Button className="form-btn" block bsSize="large" onClick={() => resetFormState()}>
                        clear
                    </Button>
                </div>
            </form>

    )      
}
    
export default ProgramsList