import axiosInstance from "@/utils/axiosConfiguration";
import contentConfiguration from "@/utils/contentConfiguration";


const axios = axiosInstance

export const getById = (id) => {
  if (!id) {
    throw new Error();
  }
  return axios.get("api/v1/public/musicians/" + id);
}

export const get = (query, pagination) => {
  let limit = 100;
  let offset = 0;
  if (pagination) {
    limit = pagination.limit ? pagination.limit : limit;
    offset = pagination.offset ? pagination.offset : offset;
  }
  query = query ? "query=" + query : null;
  let url = "api/v1/public/musicians?";
  if (query) {
    url += query + "&";
  }

  return axios.get(url + "offset=" + offset + "&limit=" + limit);
}

export const getLogoUrl = (id) => {
  return contentConfiguration.contentBaseUrl + "api/v1/public/files/pictures/" + id + "/download";
}


export default {
  get,
  getLogoUrl,
  getById
}
