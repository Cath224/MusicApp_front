import axiosInstance from "@/utils/axiosConfiguration";


const axios = axiosInstance

export const like = (id) => {
  if (!id) {
    throw new Error();
  }
  return axios.post("api/v1/public/likes/" + id);
}

export const unlike = (id) => {
  if (!id) {
    throw new Error();
  }
  return axios.delete("api/v1/public/likes/" + id);
}


export const get = (offset = 0, limit = 1000) => {

  return axios.get(`api/v1/public/likes?offset=${offset}&limit=${limit}`);
}

export const getBySongId = (songId) => {
  if (!songId) {
    throw new Error();
  }
  return axios.get("api/v1/public/likes/by-song-id/" + songId);
}

export default {
  like,
  unlike,
  get,
  getBySongId,
}
