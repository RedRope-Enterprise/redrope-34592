import api from "./api"

async function getCategories() {
  const response = await api.get("/api/v1/events/categories/", {
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

async function getMyEvents() {
  const response = await api.get("/api/v1/events/my-events/", {
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

async function addBottleService(payload) {
  console.log("payload ", payload)
  const response = await api.post("/api/v1/events/bottle-service/", payload)
  return response.data
}

async function createEvent(payload) {
  console.log("payload ", payload)
  const response = await api.post("/api/v1/events/", payload)
  return response.data
}

async function addEventToFavorite(payload) {
  console.log("payload ", payload)
  const response = await api.post("/api/v1/events/favorite/", payload)
  return response.data
}

async function markEventAsInterested(payload) {
  console.log("payload ", payload)
  const response = await api.post("/api/v1/events/register-event/", payload)
  return response.data
}

async function registerForEvent(payload) {
  console.log("payload ", payload)
  const response = await api.post("/api/v1/events/register-event/", payload)
  return response.data
}

export {
  getCategories,
  getEvents,
  getEventDetails,
  getMyEvents,
  addBottleService,
  createEvent,
  addEventToFavorite,
  markEventAsInterested,
  registerForEvent
}
