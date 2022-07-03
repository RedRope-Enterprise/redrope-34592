import api from "./api"

async function getUser() {
  const response = await api.get("/rest-auth/user/", {
    params: {}
  })
  return response.data
}

async function updateUser(payload) {
  console.log("payload ", payload)
  const response = await api.put("/rest-auth/user/", payload)
  return response.data
}

export { getUser, updateUser }
