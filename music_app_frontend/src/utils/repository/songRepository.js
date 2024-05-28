import axiosInstance from "@/utils/axiosConfiguration";


const axios = axiosInstance

export const getById = (id) => {
  if (!id) {
    throw new Error();
  }
  return axios.get("api/v1/public/songs/" + id);
}

export const get = (query, pagination) => {
  let limit = 100;
  let offset = 0;
  if (pagination) {
    limit = pagination.limit ? pagination.limit : limit;
    offset = pagination.offset ? pagination.offset : offset;
  }
  query = query ? "query=" + query : null;
  let url = "api/v1/public/songs?";
  if (query) {
    url += query + "&";
  }

  return axios.get(url + "offset=" + offset + "&limit=" + limit);
}

export const patch = (artist, id) => {
  if (artist == null || id == null) {
    throw Error()
  }
  return axios.patch("api/v1/public/songs/" + id, artist)
}

export const create = (artist) => {
  if (artist == null) {
    throw Error()
  }
  return axios.post("api/v1/public/songs", artist)
}

export const uploadFile = (file, id) => {
  if (!file || !id) {
    throw Error()
  }
  let formData = new FormData()
  formData.append("file", file)
  return axios.post(`api/v1/public/files/song/${id}`, formData)
}

export const deleteById = (id) => {
  if (id == null) {
    throw Error()
  }
  return axios.delete("api/v1/public/songs/" + id)
}

export default {
  get,
  getById,
  create,
  patch,
  deleteById,
  uploadFile,
}
