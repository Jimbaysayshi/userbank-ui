import axios from 'axios'

export const auth = checkAccess => {
    const config = {
        headers: { Authorization: `Bearer ${checkAccess.token}` }
    };
    return axios

        .post('/check-token', {
            id: checkAccess.id,
            }, config)
        .then(res => {
            this.props.history.push('/programs')
            return res.data
        })
        .catch (err => {
            console.log(err)
            this.props.history.push('/')
        })
}

export const getToken = () => {
    return localStorage.getItem('jwt-token');
}
