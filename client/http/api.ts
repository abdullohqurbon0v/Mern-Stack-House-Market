import axios from 'axios'

export const fetchData = axios.create({
  baseURL: "http://localhost:8080/api/",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

fetchData.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

fetchData.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) { }
    return Promise.reject(error)
  }
)

