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

async function deleteAccount(payload) {
  const response = await api.post("/api/v1/delete-account/", payload)
  return response.data
}

async function getUserAccountBalance(payload) {
  const response = await api.get("/api/v1/users/account-balance/", payload)
  return response.data
}

async function withdrawToBank(payload) {
  const response = await api.post("/api/v1/users/withdraw-to-bank/", payload)
  return response.data
}

async function getWalletHistory(payload) {
  const response = await api.get("/api/v1/users/withdraw-to-bank/", payload)
  return response.data
}

export { getUser, updateUser, deleteAccount, getUserAccountBalance, withdrawToBank, getWalletHistory }
