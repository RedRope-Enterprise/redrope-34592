import api from "./api"

async function getCategories() {
  const response = await api.get("/api/v1/categories/", {
    params: {}
  })
  return response.data
}

async function getEvents() {
  const response = await api.get("/api/v1/events/", {
    params: {}
  })
  return response.data
}

async function getEventDetails(id) {
  const response = await api.get(`/api/v1/events/${id}/`, {
    params: {}
  })
  return response.data
}

export { getCategories, getEvents,getEventDetails }
