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
            programChanges: [],

            formState: {
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
        console.log(programList)
        console.log(formState)
        e.preventDefault()
        const program = e.target.querySelector("input[name='program']").value      
        const username = e.target.querySelector("input[name='username']").value      
        const password = e.target.querySelector("input[name='password']").value      
        const password_re = e.target.querySelector("input[name='password_re']").value      
        if(formState.mode === "submit"){
            if(this.state.programList.length === 0){
               
                this.setState({
                    programList: [
                        ...this.state.programList,
                        {
                            program,
                            username,
                            password,
                            password_re,
                            updating: false,
                            idx: 0
                            //idx: this.state.programList[this.state.programList.lenght - 1].idx + 1
                        }
                    ]
                })
            } else {

                const len = this.state.programList.length
                const newidx = this.state.programList[len-1].idx +1 

                this.setState({
                    programList: [
                        ...this.state.programList,
                        {
                            program,
                            username,
                            password,
                            password_re,
                            updating: false,
                            idx: newidx
                        }
                    ]
                })

            }
        } else if (formState.mode === "edit"){
            const index = programList.find((item) => item.idx === formState.idx).idx
            console.log(index)
            console.log(programList[index])
            
            programList[index] = {
                program,
                username,
                password,
                updating: false,
                idx:programList[index].idx
            }
            this.setState({
                programList: [...programList]
            })
        }
        const newProgram = {
            program: program,
            username: username,
            password: password,
            id: localStorage.id
        }
        credentials(newProgram).then(res => {
            if(!res.err){
                this.resetFormState()
            }
        })
        
    }

    updateCredentials = key => {
        let { programList } = this.state
        console.log(programList)
        programList[key].updating = true
        this.setState({
            formState: { ...this.state.programList[key], mode: "edit"},
            programList
        })
        console.log(programList)

    }

    deleteCredentials = key => {
        let { programList } = this.state
        var removed = programList.splice(key, 1)
        console.log(removed[0])
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
        })

    }
   
    getToken(){
        return localStorage.getItem('jwt-token')
    }

    validateForm(formState){
        if (formState.password.length > 0 && formState.password_re.length > 0){ 
                return formState.password === formState.password_re
        }
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
        const {programList, formState} = this.state
        return (
            <div className="Programs">
                <h1>KEYBANK</h1>
                <div className="programtable">
                    <Table
                    programList={programList}
                    updateCredentials={this.updateCredentials}
                    deleteCredentials={this.deleteCredentials}
                    />
                </div>
                <div className="addform">
                    <Form
                    formState={formState}
                    onChange={this.onChange}
                    onSubmit={this.onSubmit}
                    //validateForm={this.validateForm}
                    />
                </div>
            </div>
        )
    }   
}
const Table =({ programList=[], updateCredentials, deleteCredentials }) =>{

    return(
        <table>
            <tr>
                <th>Program</th>
                <th>Username</th>
                <th>Password</th>
                <th>Actions</th>
            </tr>
            
            {programList.map((item, key) => {
                return (            
                <tr>
                    <td>
                        <p>{item.program}</p>
                    </td>
                    <td>
                        <p>{item.username}</p>
                    </td>
                    <td>
                        <p>{item.password}</p>
                    </td>
                    <td>
                    <Button className="edit-btn" block bsSize="large" onClick={() => updateCredentials(key)}>
                        edit
                    </Button>
                    <Button className="delete-btn" block bsSize="large" onClick={() => deleteCredentials(key)}>
                        delete
                    </Button>
                    </td>
                </tr>
                )
            })}
    </table>
    )
}

const Field = ({label ="", name="", value="", onChange}) =>{
        return(<div className="field-set">
            <label className="field-label" htmlFor={name}>{label}</label>
            <input className="field-input" type="text" name={name} value={value} onChange={onChange}/>
        </div>
        )}

const Form = ({ formState, onChange, onSubmit, validateForm }) => {

    return (
        <form className="form" onSubmit={onSubmit}>
            <fieldset>
                <Field 
                    name="program"
                    label="Program"
                    value={formState.program}
                    onChange={onChange}
                />
                <Field 
                    name="username"
                    label="Username"
                    value={formState.username}
                    onChange={onChange}
                />
                <Field 
                    name="password"
                    label="Password"
                    value={formState.password}
                    onChange={onChange}
                />
                <Field 
                    name="password_re"
                    label="Password again"
                    value={formState.password_re}
                    onChange={onChange}
                />
            </fieldset>
            <div className="button-group">
                <Button type={formState.mode}>
                    {formState.mode}
                </Button>
            </div>
        </form>
    )      
}
    
export default ProgramsList