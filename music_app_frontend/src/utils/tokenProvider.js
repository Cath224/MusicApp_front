

export const tokenProvider = {
  setToken: (token) => {
    localStorage.setItem("Auth", token)
  },
  clearToken: () => {
    localStorage.removeItem("Auth")
  },
  getToken: () => {
    return localStorage.getItem("Auth")
  }
}
