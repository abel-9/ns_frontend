import { API_BASE_URL } from '#/const'
import axios from 'axios'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detailed error information
    const status = error.response?.status
    const message = error.response?.data?.message || error.message
    const url = error.config?.url

    console.log(error)

    console.error(`[API Error] ${status || 'Network'} | ${url}:`, message)

    return Promise.reject(error.response?.data || error)
  }
)