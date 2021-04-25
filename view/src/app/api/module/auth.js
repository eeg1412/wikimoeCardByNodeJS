export default function (api) {
  return {
    login (data) {
      return api.post("login", data);
    },
    dailycard (data) {
      return api.post("dailycard", data);
    },
    reg (data) {
      return api.post("reg", data);
    },
    find (data) {
      return api.post("find", data);
    },
    searchcard (data) {
      return api.post("searchcard", data);
    },
    searchcardbytoken (data) {
      return api.post("searchcardbytoken", data);
    },
    sendmail (data) {
      return api.post("sendmail", data);
    },
    searchlog (data) {
      return api.post("searchlog", data);
    },
    login (data) {
      return api.post("login", data);
    },
    userinfo (data) {
      return api.post("userinfo", data);
    },
    shop (data) {
      return api.post("shop", data);
    },
    logout (data) {
      return api.post("logout", data);
    },
    news (data) {
      return api.post("news", data);
    },
    marketchart (data) {
      return api.post("marketchart", data);
    },
    marketsell (data) {
      return api.post("marketsell", data);
    },
    marketbuy (data) {
      return api.post("marketbuy", data);
    },
    battle (data) {
      return api.post("battle", data);
    },
    battlecard (data) {
      return api.post("battlecard", data);
    },
    decompose (data) {
      return api.post("decompose", data);
    },
    decomposeitem (data) {
      return api.post("decomposeitem", data);
    },
    wantcard (data) {
      return api.post("wantcard", data);
    },
    searchwantcard (data) {
      return api.post("searchwantcard", data);
    },
    searchbattleinfo (data) {
      return api.post("searchbattleinfo", data);
    },
    searchcardlevel (data) {
      return api.post("searchcardlevel", data);
    },
    searchuseritem (data) {
      return api.post("searchuseritem", data);
    },
    rank () {
      return api.get("rank");
    },
    upgradecard (data) {
      return api.post("upgradecard", data);
    },
    dailygetitem (data) {
      return api.post("dailygetitem", data);
    },
    dailygetitemmenu (data) {
      return api.post("dailygetitemmenu", data);
    },
    cardlevelchange (data) {
      return api.post("cardlevelchange", data);
    },
    searchbattlelogs (data) {
      return api.post("searchbattlelogs", data);
    },
    uploadcard (data) {
      return api.post("uploadcard", data);
    },
    handbook (data) {
      return api.post("handbook", data);
    },
    searchcrearchcard (data) {
      return api.post("searchcrearchcard", data);
    },
    searchcardpackage (data) {
      return api.post("searchcardpackage", data);
    },
    searchguesscard (data) {
      return api.post("searchguesscard", data);
    },
    userguesscard (data) {
      return api.post("userguesscard", data);
    },
    userpost (data) {
      return api.post("userpost", data);
    },
    robotcheck (data) {
      return api.post("robotcheck", data);
    },
    quest (data) {
      return api.post("quest", data);
    },
    uploadtx (data) {
      return api.post("uploadtx", data);
    },
    mysteriousFragmentShop (data) {
      return api.post("mysteriousFragmentShop", data);
    },
    searchCardCount (data) {
      return api.post("searchCardCount", data);
    },
    searchDailyCardChance (data) {
      return api.post("searchDailyCardChance", data);
    },
    searchMarketCount (data) {
      return api.post("searchMarketCount", data);
    },
    searchWantCardPackageCount (data) {
      return api.post("searchWantCardPackageCount", data);
    },
    admincheckinstall () {
      return api.get("admin/checkinstall");
    },
    admininstall (data) {
      return api.post("admin/install", data);
    },
    adminLogin (data) {
      return api.post("admin/login", data);
    },
    adminsetting (data) {
      return api.post("admin/setting", data);
    },
    admingivestar (data) {
      return api.post("admin/givestar", data);
    },
    adminsearchuser (data) {
      return api.post("admin/searchuser", data);
    },
    adminban (data) {
      return api.post("admin/ban", data);
    },
    adminpasswordchange (data) {
      return api.post("admin/passwordchange", data);
    },
    adminlogout (data) {
      return api.post("admin/logout", data);
    },
    adminsecretkey (data) {
      return api.post("admin/secretkey", data);
    },
    adminSearchlog (data) {
      return api.post("admin/searchlog", data);
    },
    adminNews (data) {
      return api.post("admin/news", data);
    },
    renamecardpackage (data) {
      return api.post("admin/renamecardpackage", data);
    },
    adminCreatcard (data) {
      return api.post("admin/creatcard", data);
    },
    adminSearchcard (data) {
      return api.post("admin/searchcard", data);
    },
    adminEditcard (data) {
      return api.post("admin/editcard", data);
    },
    adminSetRobotRate (data) {
      return api.post("admin/setrobotrate", data);
    }
  };
}
