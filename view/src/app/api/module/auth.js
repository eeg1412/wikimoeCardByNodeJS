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
    news(data){
      return api.post('news',data)
    },
    marketchart(data){
      return api.post('marketchart',data)
    },
    marketsell(data){
      return api.post('marketsell',data)
    },
    marketbuy(data){
      return api.post('marketbuy',data)
    },
    battle(data){
      return api.post('battle',data)
    },
    battlecard(data){
      return api.post('battlecard',data)
    },
    decompose(data){
      return api.post('decompose',data)
    },
    wantcard(data){
      return api.post('wantcard',data)
    },
    searchwantcard(data){
      return api.post('searchwantcard',data)
    },
    searchbattleinfo(data){
      return api.post('searchbattleinfo',data)
    },
    searchcardlevel(data){
      return api.post('searchcardlevel',data)
    },
    searchuseritem(data){
      return api.post('searchuseritem',data)
    },
    rank(){
      return api.get('rank')
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
    adminNews(data){
      return api.post('admin/news',data)
    },
  }
}
