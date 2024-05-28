import axiosInstance from "@/utils/axiosConfiguration";


const axios = axiosInstance

export const getByArtistsId = (id) => {
  if (!id) {
    throw new Error();
  }
  return axios.get("api/v1/public/musicians/" + id + "/top");
}

export const getTop10Songs = () => {
  return axios.get("api/v1/public/tops/songs");
}


export const getNewestSongs = () => {
  return axios.get("api/v1/public/tops/songs-newest");
}


export const getTop10Artists = () => {
  return axios.get("api/v1/public/tops/musician");
}


export default {
  getByArtistsId,
  getTop10Songs,
  getNewestSongs,
  getTop10Artists,
}
