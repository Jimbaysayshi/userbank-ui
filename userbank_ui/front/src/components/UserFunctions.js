import axios from 'axios'
import Cookie from 'js-cookie'


export const register = newUser => {
    
    return axios
        .post('/signup',{
            username: newUser.username,
            masterkey: newUser.masterkey
        })
        .then(res => {
            return res
        })
        .catch(err =>{
            console.log(err)
        })

}

export const logout = user => {
    const userID = localStorage.getItem('id')
    return axios 
        .post('/logout', {
            username: user.username,
            id: userID
        })
        .then(res => {
            return res
        })
        .catch(err => {
            console.log(err)
        })
}

export const login = user => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        credentials: 'include',}    

    return axios

        .post('/login', {
            username: user.username,
            masterkey: user.masterkey
            }, config)
        .then(res => {
            localStorage.setItem('jwt-token', res.data.token)
            localStorage.setItem('id', res.data.id)
            Cookie.set("token", res.data.token, {'expires': 10})
            Cookie.set("refresh_token", res.data.refresh_token, {'expires': 60})
            return res
        })
        .catch (err => {
            console.log(err)
        })
}

export const credentials = credentialSet => {
    const token = localStorage.getItem('jwt-token');
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const userID = localStorage.getItem('id')
    return axios
     
        .post('/add-program', {
            program: credentialSet.program,
            username: credentialSet.username,
            password: credentialSet.password,
            index: credentialSet.index,
            id: userID,
            },config)
        .then(res => {
            return res
        })
        .catch (err => {
            console.log(err)
        })
}


export const remove = removeProgram => {
    const token = localStorage.getItem('jwt-token');
    const userID = localStorage.getItem('id')
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    return axios
     
        .post('/remove-program', {
            program: removeProgram.program,
            username: removeProgram.username,
            id: userID,
            }, config)
        .then(res => {

            return res
        })
        .catch (err => {
            console.log(err)
        })
}


export const programs = token => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    }

    return axios
        .get('/programs', config)
        .then(res => {
            return res
        })
        //.catch(error => {
        //    console.log('error')
        //    console.log(error.response)
        //})


}

export const change = credentialSet => {
    const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt-token')}` }
    };
    return axios
     
        .post('/change-credentials', {
            program: credentialSet.program,
            username: credentialSet.username,
            password: credentialSet.password,
            index: credentialSet.index,
            user_id: localStorage.getItem('id')
            }, config)
        .then(res => {

            return res
        })
        .catch (err => {
            console.log(err)
        })
}



