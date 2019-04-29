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
    userinfo(data){
      return api.post('userinfo',data)
    },
    shop(data){
      return api.post('shop',data)
    },
    logout(data){
      return api.post('logout',data)
    },
    admincheckinstall(){
      return api.get('admin/checkinstall')
    },
    admininstall(data){
      return api.post('admin/install',data)
    },
    adminLogin(data){
      return api.post('admin/login',data)
    },
    adminsetting(data){
      return api.post('admin/setting',data)
    },
    admingivestar(data){
      return api.post('admin/givestar',data)
    },
    adminsearchuser(data){
      return api.post('admin/searchuser',data)
    },
    adminban(data){
      return api.post('admin/ban',data)
    },
    adminpasswordchange(data){
      return api.post('admin/passwordchange',data)
    },
    adminlogout(data){
      return api.post('admin/logout',data)
    },
    adminsecretkey(data){
      return api.post('admin/secretkey',data)
    },
    adminSearchlog(data){
      return api.post('admin/searchlog',data)
    },
  }
}
