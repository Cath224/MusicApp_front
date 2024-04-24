import contentConfiguration from "@/utils/contentConfiguration";
import axiosInstance from "@/utils/axiosConfiguration";
import {userProvider} from "@/utils/userProvider";


const axios = axiosInstance


export const getSongUrl = (id) => {
  if (!id) {
    throw new Error();
  }
  console.log(`api/v1/public/play/song/${id}?login=${userProvider.getUser()}`)
  return contentConfiguration.contentBaseUrl + `api/v1/public/play/song/${id}?login=${userProvider.getUser()}`;
}

export const generateQueue = (id) => {
  if (!id) {
    throw new Error();
  }
  return axios.post(`api/v1/public/play/generate/by-song-id/${id}`)
}

export const getCurrentQueue = () => {
  return axios.get(`api/v1/public/play/current-queue`)
}

export default {
  getSongUrl,
  generateQueue,
  getCurrentQueue
}
