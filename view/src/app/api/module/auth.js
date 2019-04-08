export default function (api) {
  return {
    login(data) {
      return api.post('login',data)
    },
    dailycard(data){
      return api.post('dailycard',data)
    },
    reg(data){
      return api.post('reg',data)
    },
    find(data){
      return api.post('find',data)
    },
    searchcard(data){
      return api.post('searchcard',data)
    },
    sendmail(data){
      return api.post('sendmail',data)
    },
    searchlog(data){
      return api.post('searchlog',data)
    },
    login(data){
      return api.post('login',data)
    },
  }
}
