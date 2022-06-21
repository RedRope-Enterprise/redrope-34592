import api from "./api"

async function getFaqs() {
  const response = await api.get("/api/v1/faqs/", {
    params: {}
  })
  return response.data
}

export { getFaqs }
