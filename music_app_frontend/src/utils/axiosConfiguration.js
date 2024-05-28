import axios from "axios";
import {tokenProvider} from "@/utils/tokenProvider";
import {userProvider} from "@/utils/userProvider";
import router from "@/router";
import eventBus from "@/utils/eventBusConfiguration";


const axiosConfig = {
  baseURL: 'http://127.0.0.1:8092/',
  timeout: Number.MAX_VALUE
};

const axiosInstance = axios.create(axiosConfig)

axiosInstance.interceptors.request.use(function (config) {
  const token = tokenProvider.getToken()
  if (token) {
    config.headers.set('Authorization', `Bearer ${tokenProvider.getToken()}`)
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  // Do something with request error
  if (error?.response?.status === 403) {
    tokenProvider.clearToken()
    userProvider.clearUser()
    eventBus.emit("error", {
      code: 403
    })
    if (router.currentRoute.value.name === 'auth') {
      return Promise.reject(error);
    }
    return router.push({name: 'auth'}).then(() => error)
  }
  eventBus.emit("error", {
    code: 500
  })
  return Promise.reject(error);

});


export default axiosInstance;
