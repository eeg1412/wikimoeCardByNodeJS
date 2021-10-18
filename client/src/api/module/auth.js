export default function(api) {
  return {
    register(data) {
      return api.post('/public/register', data)
    },
    login(data) {
      return api.post('/public/login', data)
    },
  }
}
