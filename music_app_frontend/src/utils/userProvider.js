

export const userProvider = {
  setUser: (user) => {
    localStorage.setItem("User", user)
  },
  clearUser: () => {
    localStorage.removeItem("User")
  },
  getUser: () => {
    return localStorage.getItem("User")
  }
}
