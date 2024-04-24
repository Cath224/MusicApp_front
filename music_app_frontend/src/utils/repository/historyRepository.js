import axiosInstance from "@/utils/axiosConfiguration";


const axios = axiosInstance


export const get = (offset = 0, limit = 1000) => {
  return axios.get(`api/v1/public/history?offset=${offset}&limit=${limit}`)
}

export const deleteBySongId = (songId) => {
  if (!songId) {
    throw Error()
  }
  return axios.delete(`api/v1/public/history/by-song/${songId}`)
}


export default {
  get,
  deleteBySongId,
}
