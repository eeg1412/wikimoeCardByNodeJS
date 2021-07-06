import axios from 'axios'

export function createAPI(config) {
  return axios.create(config)
}
