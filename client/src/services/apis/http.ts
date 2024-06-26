import axios, { AxiosError, AxiosInstance } from 'axios'
import { authActions } from '../../redux/slices/auth.slice'
import store from '../../redux/store'
import { lsActions } from '../../utils/auth'
import { baseURL } from '../config'

class Http {
  instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.instance.interceptors.request.use(
      config => {
        config.headers.Authorization = `Bearer ${lsActions.getToken()}`
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          store.dispatch(authActions.logout())
        }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http
