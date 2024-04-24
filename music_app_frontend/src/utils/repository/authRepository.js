import axiosInstance from "@/utils/axiosConfiguration";


const axios = axiosInstance


export const login = (credentials) => {
  if (!credentials.login || !credentials.password) {
    throw Error()
  }
  return axios.post('api/v1/public/auth', {
    login: credentials.login,
    password: credentials.password
  })
}
export const register = (credentials) => {
  if (!credentials.login || !credentials.password || !credentials.name || !credentials.email) {
    throw Error()
  }
  return axios.post('api/v1/public/register', {
    login: credentials.login,
    password: credentials.password,
    name: credentials.name,
    email: credentials.email
  })
}

export default {
  login,
  register,
}
