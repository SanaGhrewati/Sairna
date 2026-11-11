import axios from "axios"

const sairnaApi = axios.create({
  baseURL:
    "https://sairna.abdulrahman-hares.com/api/v1/website",
  headers: {
    "Content-Type": "application/json",
  },
})

sairnaApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("passengerToken")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default sairnaApi