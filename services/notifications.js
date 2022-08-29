import api from "./api"

async function getAllNotifications(params = "") {
  const response = await api.get("/api/v1/users/notifications/", {
    params: {}
  })
  return response.data
}

export { getAllNotifications }
