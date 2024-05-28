import axiosInstance from "@/utils/axiosConfiguration";
import contentConfiguration from "@/utils/contentConfiguration";


const axios = axiosInstance

export const get = (query, pagination) => {
  let limit = 100;
  let offset = 0;
  if (pagination) {
    limit = pagination.limit ? pagination.limit : limit;
    offset = pagination.offset ? pagination.offset : offset;
  }
  query = query ? "query=" + query : null;
  let url = "api/v1/public/users?";
  if (query) {
    url += query + "&";
  }

  return axios.get(url + "offset=" + offset + "&limit=" + limit);
}


export const getCurrent = () => {
  return axios.get("api/v1/public/users/current")
}

export const patch = (user, id) => {
  if (id == null || user == null) {
    throw Error()
  }
  return axios.patch("api/v1/public/users/" + id, user)
}

export const uploadLogo = (file, id) => {
  if (!file || !id) {
    throw Error()
  }
  let formData = new FormData()
  formData.append("file", file)
  return axios.post(`api/v1/public/files/picture/USER/${id}`, formData)
}

export const getLogoUrl = (id) => {
  return contentConfiguration.contentBaseUrl + "api/v1/public/files/pictures/" + id + "/download";
}

export default {
  getCurrent,
  patch,
  getLogoUrl,
  get,
  uploadLogo,
}
