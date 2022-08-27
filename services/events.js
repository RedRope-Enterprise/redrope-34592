import api from "./api"

async function getCategories() {
  const response = await api.get("/api/v1/events/categories/", {
    params: {}
  })
  return response.data
}

async function getIntrests() {
  const response = await api.get("/api/v1/events/interests/", {
    params: {}
  })
  return response.data
}

async function getEvents(params = {}) {
  var queryString = Object.keys(params)
    .map(key => key + "=" + params[key])
    .join("&")
  let append = Object.keys(params).length > 0 ? "?" + queryString : ""
  const response = await api.get("/api/v1/events/" + append)

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

async function removeEventFromFavorite(id) {
  const response = await api.delete(`/api/v1/events/favorite/${id}/`, {})
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

async function activeDeactiveEvent(payload) {
  console.log("payload ", payload)
  const response = await api.put(
    `/api/v1/events/${payload.id}/activate-deactivate/`,
    { active: payload.status }
  )
  return response.data
}

async function deleteEvent(payload) {
  console.log("payload ", payload)
  const response = await api.delete(`/api/v1/events/${payload}/delete/`, {})
  return response.data
}

async function updateEvent(payload, id) {
  console.log("payload ", payload)
  const response = await api.patch(`/api/v1/events/${id}/`, payload)
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
  registerForEvent,
  getIntrests,
  removeEventFromFavorite,
  activeDeactiveEvent,
  deleteEvent,
  updateEvent
}
