import { createAPI } from './create-api'
import auth from './module/auth'

const api = createAPI({ baseURL: '/api' })

export const authApi = auth(api)
