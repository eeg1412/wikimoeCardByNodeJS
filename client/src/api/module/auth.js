export default function (api) {
  return {
    register (data) {
      return api.post('/register', data)
    },
    login (data) {
      return api.post('/login', data)
    },
  }
}
