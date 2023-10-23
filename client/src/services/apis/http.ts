import axios, { AxiosError, AxiosInstance } from 'axios'
import { lsActions } from '../../utils/auth'

class Http {
  instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: 'http://localhost:8420',
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
        // if (error.response?.status === 401) {
        //   lsActions.clearLS(true)
        // }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http
