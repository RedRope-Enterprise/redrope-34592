import api from "./api"

async function getFaqs(params = "") {
  const response = await api.get("/api/v1/faqs/" + "?" + params, {
    params: {}
  })
  return response.data
}

export { getFaqs }
