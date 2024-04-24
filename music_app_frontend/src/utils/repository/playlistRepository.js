import axiosInstance from "@/utils/axiosConfiguration";


const axios = axiosInstance


export const get = (offset = 0, limit = 1000) => {
  return axios.get(`api/v1/public/playlists?offset=${offset}&limit=${limit}`);
}

export const create = (value) => {
  if (!value) {
    throw Error()
  }
  return axios.post("api/v1/public/playlists", value)
}

export const update = (value, id) => {
  if (!value || !id) {
    throw Error()
  }
  return axios.patch(`api/v1/public/playlists/${id}`, value)
}

export const deleteSongs = (value, id) => {
  if (!value || !id) {
    throw Error()
  }
  return axios.patch(`api/v1/public/playlists/${id}/_songs`, value)
}

export const uploadLogo = (file, id) => {
  if (!file || !id) {
    throw Error()
  }
  let formData = new FormData()
  console.log(file)
  formData.append("file", file[0])
  return axios.post(`api/v1/public/files/picture/PLAYLIST/${id}`, formData)
}

export const getById = (id) => {
  if (!id) {
    throw new Error();
  }
  return axios.get("api/v1/public/playlists/" + id);
}

export default {
  get,
  create,
  update,
  getById,
  uploadLogo,
  deleteSongs,
}
