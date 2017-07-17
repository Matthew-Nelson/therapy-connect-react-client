import axios from 'axios'
import jwt_decode from 'jwt-decode'

axios.defaults.baseURL = 'https://therapy-connect-api.herokuapp.com/'
// axios.defaults.baseURL = 'http://localhost:3001/'

const clientAuth = {

  setTokenHeader: () => {
    const token = localStorage.getItem('token')
    if(token) {
      axios.defaults.headers.common['x-access-token'] = localStorage.getItem('token')
    }
  },

  signUp: (userInfo) => {
    return axios({
      url: '/api/users',
      method: 'post',
      data: userInfo
    })
  },

  logIn: (credentials) => {
    return axios({
      url: '/api/users/login',
      method: 'post',
      data: credentials
    })
    .then(res => {
      if(res.data.token) {
        //this code hasent run unless we log in, we need to setToken above
        localStorage.setItem('token', res.data.token)
        //now we can run the fnx
        clientAuth.setTokenHeader()
        return jwt_decode(res.data.token)
      } else {
        return false
      }
    })
  },

  getCurrentUser: () => {
    const token = localStorage.getItem('token')
    return token ? jwt_decode(token) : null
  },

  getClients: (id) => {
    return axios({
      url: `/api/users/${id}`
    })
  },

  getRoutine: (id) => {
    return axios({
      url: `/api/routines/${id}`,
      method: 'get'
    })
  },

  logOut: () => {
    return new Promise((resolve) => {
      localStorage.clear()
      delete axios.defaults.headers.common['x-access-token']
      resolve("logging out")
    })
  },

  getRoutines: () => {
    return axios({
      url: '/api/routines',
      method: 'get'
    })
  },

  addRoutine: (newRoutine) => {
    return axios({
      url: '/api/routines',
      method: 'post',
      data: newRoutine
    })
  },

  deleteRoutine: (id) => {
    return axios({
      //fancy way of interpolating a string
      url: `/api/routines/${id}`,
      method: 'delete'
    })
  },

  addPt: (ptId) => {
    // console.log(data.pt);
    return axios({
      // url: `/api/users/${data.user}/therapist/${data.pt}`,
      url: `/api/users/${ptId}`,
      method: 'post'
    })
  },

  updateRoutine: (clientId, routineId) => {
    return axios({
      url: `/api/users/${clientId}/routine/${routineId}`,
      method: 'post'
      // data: routineId
    })
  },

  getTherapist: (therapistId) => {
    return axios({
      url: `/api/users/${therapistId}`,
      method: 'get'
    })
  },

  //where we are updating our therapist
  updateTherapist: (therapist) => {
    return axios({
      url: `/api/users/${therapist._id}`,
      method: 'patch',
      data: therapist
    })
  }

}

clientAuth.setTokenHeader()
export default clientAuth
