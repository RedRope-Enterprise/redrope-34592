import api from "./api"

async function getCardsList() {
  const response = await api.get("/api/v1/payments/cards/", {
    params: {}
  })
  return response.data
}

async function createCard(params = {}) {
  console.log(params)
  const response = await api.post("/api/v1/payments/cards/", params)
  return response.data
}

async function updateCard() {
  const response = await api.put("/api/v1/payments/cards/", {
    params: {}
  })
  return response.data
}

async function deleteCard(params = {}) {
  const response = await api.delete("/api/v1/payments/cards/", {
    data: params
  })
  return response.data
}

async function createPaymentIntent(params = {}) {
  const response = await api.post("/api/v1/events/payment-intent/", params)
  return response.data
}

async function confirmReservation(params = {}) {
  const response = await api.post("/api/v1/events/confirm-reservation/", params)
  return response.data
}

export {
  getCardsList,
  createCard,
  updateCard,
  deleteCard,
  createPaymentIntent,
  confirmReservation
}
