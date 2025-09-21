import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

const api = axios.create({ 
  baseURL: 'https://2236ufm7r2yegkz3q73lftccqa0bpgeh.lambda-url.ap-south-1.on.aws/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default defineBoot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
