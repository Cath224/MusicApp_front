import axiosInstance from "@/utils/axiosConfiguration";


const axios = axiosInstance

export const getByArtistsId = (id) => {
  if (!id) {
    throw new Error();
  }
  return axios.get("api/v1/public/musicians/" + id + "/top");
}


export default {
  getByArtistsId
}
