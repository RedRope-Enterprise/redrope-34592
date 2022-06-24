import api from "./api"

async function submitFeedback(params) {
  const response = await api.post("/api/v1/feedback-support/", params)
  return response.data
}

export { submitFeedback }
