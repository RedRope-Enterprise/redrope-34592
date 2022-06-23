import axios from "axios"
import { getGlobalOptions } from "@options"
import { getDataStorage } from "../utils/storage"

const global = getGlobalOptions()
const BASE_URL = global.url // change your BASE_URL in `options/options.js` to edit this value

const api = axios.create({
  baseURL: BASE_URL,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
})

const onRequest = async config => {
  let key = await getDataStorage("@key")
  console.log("kkey ", key)
  if (key) {
    config.headers.authorization = `Token ${key}`
  }
  return config
}

api.interceptors.request.use(onRequest)


export default api