import axiosInstance from "@/utils/axiosConfiguration";
import contentConfiguration from "@/utils/contentConfiguration";


const axios = axiosInstance

export const getById = (id) => {
  if (!id) {
    throw new Error();
  }
  return axios.get("api/v1/public/albums/" + id);
}

export const get = (query, pagination) => {
  let limit = 100;
  let offset = 0;
  if (pagination) {
    limit = pagination.limit ? pagination.limit : limit;
    offset = pagination.offset ? pagination.offset : offset;
  }
  query = query ? "query=" + query : null;
  let url = "api/v1/public/albums?";
  if (query) {
    url += query + "&";
  }

  return axios.get(url + "offset=" + offset + "&limit=" + limit);
}

export const getLogoUrl = (id) => {
  return contentConfiguration.contentBaseUrl + "api/v1/public/files/pictures/" + id + "/download";
}

export const patch = (artist, id) => {
  if (artist == null || id == null) {
    throw Error()
  }
  return axios.patch("api/v1/public/albums/" + id, artist)
}

export const create = (artist) => {
  if (artist == null) {
    throw Error()
  }
  return axios.post("api/v1/public/albums", artist)
}

export const uploadLogo = (file, id) => {
  if (!file || !id) {
    throw Error()
  }
  let formData = new FormData()
  formData.append("file", file)
  return axios.post(`api/v1/public/files/picture/ALBUM/${id}`, formData)
}

export const deleteById = (id) => {
  if (id == null) {
    throw Error()
  }
  return axios.delete("api/v1/public/albums/" + id)
}

export const getShort = () => {
  return axios.get("api/v1/public/albums/short")
}

export default {
  get,
  getLogoUrl,
  getById,
  create,
  patch,
  deleteById,
  uploadLogo,
  getShort,
}
