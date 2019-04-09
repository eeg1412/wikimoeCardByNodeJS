<template>
<div class="common_body">
  <h5 class="wm_card_chiose_title">欢迎来到维基萌抽卡</h5>
  <div class="wm_card_email_body">
    <transition name="el-fade-in-linear">
      <div class="wm_card_email_input_body" v-show="!seled">
        <el-input v-model="email" placeholder="请先输入邮箱地址再点击卡片" class="wm_card_email"></el-input>
      </div>
    </transition>
    <transition name="el-fade-in-linear">
      <div class="wm_card_restart_body" v-show="seled">
        <el-button type="primary" @click="restart" :disabled="restartDisabled">重新抽卡</el-button>
      </div>
    </transition>
  </div>
  <transition name="el-fade-in-linear">
    <div class="wm_card_remember_body">
      <el-checkbox v-model="remEmail">抽卡并保存邮箱地址</el-checkbox>
    </div>
  </transition>
  <div class="cardList" ref="cardListParents">
    <div class="cardList_body" ref="cardListBody">
      <div class="card_list" :class="seled?'selectedcard':''" @click="getDailyCard(0)">
        <rotate3DCard trigger="custom" v-model="cardIsRotate[0]" direction="row" :cardSrc="getCardList[0]">
          <slot name="cz"></slot>
          <slot name="cf"></slot>
        </rotate3DCard>
      </div>
      <div class="card_list" :class="seled?'selectedcard':''" @click="getDailyCard(1)">
        <rotate3DCard trigger="custom" v-model="cardIsRotate[1]" direction="row" :cardSrc="getCardList[1]">
          <slot name="cz"></slot>
          <slot name="cf"></slot>
        </rotate3DCard>
      </div>
      <div class="card_list" :class="seled?'selectedcard':''" @click="getDailyCard(2)">
        <rotate3DCard trigger="custom" v-model="cardIsRotate[2]" direction="row" :cardSrc="getCardList[2]">
          <slot name="cz"></slot>
          <slot name="cf"></slot>
        </rotate3DCard>
      </div>
    </div>
  </div>
  <div class="wm_user_info_body">
    <el-collapse-transition>
      <div class="wm_mycard_list" v-if="userCard">
        <h5 class="wm_card_chiose_title">
          <el-tooltip class="item" effect="dark" content="点击分享卡牌信息" placement="top" :hide-after="3000">
            <img class="wm_title_info_avatar_pic" :src="nowUserInfo.tx" width="45" height="45" @click="openShare()">
          </el-tooltip>
          <br>
          <span>{{nowUserInfo.nickName}}的当前信息</span>
        </h5>
        <table class="wm_user_info_table">
          <thead>
            <tr>
              <th>等级</th>
              <th>竞技点</th>
              <th>收集率</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="wm_user_level">{{nowUserInfo.level}}</td>
            <td class="wm_user_score">{{nowUserInfo.score}}</td>
              <td class="wm_user_getcard_count">{{nowUserInfo.cardCol}}/{{nowUserInfo.cardCount}}</td>
            </tr>
          </tbody>
        </table>
        <sequential-entrance delay="100" tag="div">
          <div v-for="(item,index) in userCard" v-bind:key="index+1" class="wm_getcard_box">
            <img class="wm_getcard_img" :src="'/static/img/'+PrefixInteger_(item[0],4)+'.jpg'" @click="openImg('/static/img/'+PrefixInteger_(item[0],4)+'.jpg')">
            <br>
            <span class="wm_card_nums">×{{item[1]}}</span>
          </div>
        </sequential-entrance>
        <el-pagination
          small
          layout="prev, pager, next"
          :total="cardTotle"
          @current-change="cardPageChange"
          :current-page.sync="cardPage"
          :page-size="20"
          class="my_card_page">
        </el-pagination>
      </div>
    </el-collapse-transition>
  </div>
  <el-dialog
    title="分享卡牌信息"
    :visible.sync="shareDialog"
    class="reg_code_dialog"
    width="100%">
    <el-input v-model="shareUrl" disabled class="copyShareUrl">
    </el-input>
    <span slot="footer" class="dialog-footer">
      <el-button @click="shareDialog = false">关闭</el-button>
      <el-button type="primary" @click="copyUrl">复制</el-button>
    </span>
  </el-dialog>
  <menuView ref="menu"></menuView>
  <div class="wm_card_get_list_body" v-if="logList.length>0">
    <h5 class="wm_card_chiose_title">最新动态</h5>
    <div class="wm_card_get_list_item_body">
      <transition-group name="el-fade-in-linear">
        <div class="wm_card_get_list_item" v-for="(item,index) in logList" v-bind:key="index+1">
          <div class="wm_card_get_list_avatar" @click="watchUserCard(item.md5)">
            <el-tooltip class="item" effect="dark" :content="'查看'+item.nickName+'的卡牌'" placement="top" :hide-after="3000">
              <img class="wm_card_get_list_avatar_pic" :src="'https://cdn.v2ex.com/gravatar/'+item.md5+'?s=100&amp;d=mm&amp;r=g&amp;d=robohash'" width="45" height="45" data-md5="5e6892e999ca8c85a358d21164167f38">
            </el-tooltip>
          </div>
          <div class="wm_card_get_list_comment">
            <p>
              <span class="wm_log_name">{{item.nickName}}</span>
              <span class="wm_log_time">{{item.time|capitalize}}</span>
            </p>
            <p>
              <span v-if="item.type=='register'">
                大家好，我是萌新{{item.nickName}}。初来乍到对什么都还很陌生，还恳请大家能够多多指导我怎么抽出六星卡！
              </span>
              <span v-if="item.type=='dailyCard'">
                我抽中了出自作品《{{item.data.title}}》的{{item.data.star}}星卡<span class="wm_card_get_list_card_link" :class="item.data.star>=6?'wm_six_star_card_shake':''" @click="openImg('/static/img/'+PrefixInteger_(item.data.cardId,4)+'.jpg')">{{item.data.name}}</span>。
                {{item.data.star|cardStarText}}
              </span>
              <span v-if="item.type=='demining'">
                我用{{item.data.pickaxe | pickaxeName}}在<span class="wm_card_get_list_card_link" @click="goMenu('/demining')">星星矿场</span>坐标【{{item.data.x+1}},{{item.data.y+1}}】处挖到了{{item.data.star}}颗星星，同时获得了{{item.data.exp}}点经验值！！请叫我专业的矿工！
              </span>
              <span v-if="item.type=='shop_1'">
                我用{{item.data.star}}颗星星在<span class="wm_card_get_list_card_link" @click="goMenu('/star/shop')">星星商店</span>购买了{{item.data.times}}次抽卡机会，共抽中了<span class="wm_card_get_list_card_link" @click="openShopCard(item.data.card6)">{{item.data.card6.length}}</span>张六星卡、<span class="wm_card_get_list_card_link" @click="openShopCard(item.data.card5)">{{item.data.card5.length}}</span>张五星卡、<span class="wm_card_get_list_card_link" @click="openShopCard(item.data.card4)">{{item.data.card4.length}}</span>张四星卡、<span class="wm_card_get_list_card_link" @click="openShopCard(item.data.card3)">{{item.data.card3.length}}</span>张三星及其以下的卡。
              </span>
            </p>
          </div>
        </div>
      </transition-group>
      <div class="log_page">
        <el-pagination
          small
          layout="prev, pager, next"
          :total="logListTotal"
          @current-change="logPageChange"
          :current-page.sync="logPage"
          :page-size="5"
          class="my_log_page">
        </el-pagination>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {authApi} from "../api";
import {scrollToTop,mailCheck,PrefixInteger,md5Check,loadingImg,showLoading,hideLoading} from "../../utils/utils";
import rotate3DCard from '../components/rotateCard.vue';
import menuView from '../components/menu.vue';
import md5 from 'js-md5';
export default {
  data() {
    return {
      shareDialog:false,
      shareUrl:'',
      logListTotal:0,
      logPage:1,
      logList:[],
      remEmail:false,//是否记住邮箱
      email:'',//邮箱地址
      getCardList:['','',''],//卡牌图片地址
      cardIsRotate:[false,false,false],//卡牌翻牌
      seled:false,//已经翻过了
      restartDisabled:true,//重启按钮是否可用
      userCard:null,//用户当前页卡牌
      userCardCache:null,//用户卡牌
      cardPage:1,//当前卡牌页码
      cardTotle:0,//一共多少
      nowUserInfo:{
        tx:'',//头像地址
        score:0,//竞技点
        level:0,//等级
        cardCol:0,//收集卡牌
        nickName:'',
        cardCount:0,
        md5:''
      }//当前用户信息
    }
  },
  components: {
    rotate3DCard,
    menuView
  },
  filters: {
    pickaxeName(value){
      if(value==0){
        return '铁镐';
      }else if(value==1){
        return '银镐';
      }else if(value==2){
        return '金镐';
      }else{
        return '';
      }
    },
    cardStarText(value){
      if(value<=3){
        return '虽然卡牌星级不高，但是我也很喜欢！';
      }else if(value==4){
        return '不好不差，证明我既不是非洲人也不是欧洲人。';
      }else if(value==5){
        return '运气不错，距离欧皇就差一点点。';
      }else if(value==6){
        return '欧气满满，欧耶~';
      }else{
        return '';
      }
    },
    capitalize(value) {
        var date = new Date(parseInt(value*1000));
        var tt = [date.getFullYear(), ((date.getMonth()+1)<10?'0'+(date.getMonth()+1):date.getMonth()+1), (date.getDate()<10?'0'+date.getDate():date.getDate())].join('-') + '  ' +[(date.getHours()<10?'0'+date.getHours():date.getHours()), (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()), (date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds())].join(':');
        return tt;
      }
  },
  mounted() {
    this.getRememberEmail();
    this.getLog(1);
    this.setCardScroll();
    this.urlUserInfo();
  },
  methods: {
    openShopCard(cardArr){
      if(cardArr.length<1){
        return false;
      }
      let shopImgHTML = '';
      for(let i=0;i<cardArr.length;i++){
        shopImgHTML = shopImgHTML+'<div class="watch_shop_img"><img src="'+'/static/img/'+PrefixInteger(cardArr[i],4)+'.jpg'+'" /></div>';
      }
      this.$alert('<div class="watch_shop_body">'+shopImgHTML+'</div>', '查看卡牌', {
        dangerouslyUseHTMLString: true,
        customClass:'watchShopAlert'
      });
    },
    goMenu(p){
      this.$refs.menu.login(p);
    },
    copyUrl: function () {
      this.$copyText(this.shareUrl).then( (e) => {
        this.$message({
          message: '复制分享地址成功！',
          type: 'success'
        });
      }, function (e) {
        this.$message.error('复制失败，请手动复制！');
        console.log(e)
      })
    },
    openShare(){
      this.shareUrl = window.location.origin + '?md5=' + this.nowUserInfo.md5;
      this.shareDialog = true;
    },
    urlUserInfo(){
      let urlMD5 = this.$route.query.md5;
      if(urlMD5!==undefined){
        this.getUserCard(urlMD5,false);
        this.$router.replace({ path:'/'});
      }
    },
    setCardScroll(){
      //小屏滚动条
      var cardListWidth = this.$refs.cardListParents.clientWidth;
      var wmGetCardWidth = this.$refs.cardListBody.clientWidth;
      console.log(cardListWidth);
      if(wmGetCardWidth>cardListWidth){
        this.$refs.cardListParents.scrollLeft = (wmGetCardWidth-cardListWidth)/2;
      }
    },
    getLog(page){
      authApi.searchlog({page: page}).then(res => {
          console.log(res);
          if(res.data.code==0){
            this.$message.error(res.data.msg);
          }else if(res.data.code==1){
            let logListData = res.data.data;
            for(let i=0;i<logListData.length;i++){
              if(logListData[i].type=='shop_1'){//判断是否为商店
                let shopCardData = logListData[i].data.card;
                let card3 = [];
                let card4 = [];
                let card5 = [];
                let card6 = [];
                for(let j=0;j<shopCardData.length;j++){
                  if(Number(shopCardData[j])<1000){//三星卡及其以下
                    card3.push(shopCardData[j]);
                  }else if(Number(shopCardData[j])<2000){//四星卡
                    card4.push(shopCardData[j]);
                  }else if(Number(shopCardData[j])<3000){//五星卡
                    card5.push(shopCardData[j]);
                  }else if(Number(shopCardData[j])<4000){//六星卡
                    card6.push(shopCardData[j]);
                  }
                }
                logListData[i].data.card3 = card3;
                logListData[i].data.card4 = card4;
                logListData[i].data.card5 = card5;
                logListData[i].data.card6 = card6;
              }
            }
            console.log(logListData);
            this.logList = logListData;
            this.logListTotal = res.data.total;
            this.logPage = page;
          }
      });
    },
    openImg(imgsrc){
      this.$alert('<div class="watch_img"><img src="'+imgsrc+'" /></div>', '查看卡牌', {
        dangerouslyUseHTMLString: true
      });
    },
    logPageChange(val){
      this.getLog(val);
    },
    cardPageChange(val,noGoTop){
      let userCard_ = this.userCardCache.slice((val-1)*20,val*20);
      let userCardSrc = [];
      for(let i = 0;i<userCard_.length;i++){
        let userCardSrcItem = '/static/img/'+PrefixInteger(userCard_[i][0],4)+'.jpg';
        userCardSrc.push(userCardSrcItem);
      }
      showLoading();
      new Promise((resolve, reject)=>{
        loadingImg(userCardSrc,resolve, reject);
      }).then((result) => {
          this.userCard=null;
          setTimeout(()=>{
            if(!noGoTop){
              scrollToTop(450,200);
            }
            hideLoading();
            this.userCard = userCard_;
          },300);
      }).catch((reason)=> {
        console.log(reason);
          hideLoading();
          this.$message.error('图片资源加载失败');
      });
    },
    PrefixInteger_(num,length){
      return PrefixInteger(num,length);
    },
    watchUserCard(md5){
      setTimeout(()=>{
        this.getUserCard(md5);
      },0)
    },
    getUserCard(md5,noGoTop){
      if(!md5Check(md5)){
        this.$message.error('用户信息有误！');
        return false;
      }
      authApi.searchcard({md5: md5}).then(res => {
          console.log(res);
          if(res.data.code==0){
            this.$message.error(res.data.msg);
          }else if(res.data.code==1){
            let resData = res.data;
            if(res.data.card){
              this.userCardCache = Object.entries(res.data.card);
              this.userCardCache.reverse();
              this.cardPage = 1;
              this.cardTotle = this.userCardCache.length;
              this.cardPageChange(1,noGoTop);
              console.log(this.nowUserInfo);
              this.nowUserInfo = {
                tx:'https://cdn.v2ex.com/gravatar/'+resData.md5+'?s=100&d=mm&r=g&d=robohash',//头像地址
                score:resData.score,//竞技点
                level:resData.level,//等级
                cardCol:this.cardTotle,//收集卡牌
                nickName:resData.nickName,
                cardCount:resData.cardCount,
                md5:resData.md5
              };//当前用户信息
              console.log(this.userCardCache);
              //this.userCard = res.data.card;
            }else{
              this.$message({
                message: resData.nickName+'还没有获得过卡牌呢！',
                type: 'warning'
              });
            }
          }
      });
    },
    getRememberEmail(){
      var storage=window.localStorage;
      if(storage.getItem("wikimoeEmail")){
        this.email = storage.getItem("wikimoeEmail");
        this.remEmail = true;
      }
    },
    rememberEmail(){
      var storage=window.localStorage;
      if(this.remEmail){
        storage.setItem("wikimoeEmail",this.email);
      }else{
        storage.removeItem("wikimoeEmail");
      }
    },
    restart(){
      this.restartDisabled = true;
      this.$refs.cardListBody.children[0].classList.remove("no-selectedcard");
      this.$refs.cardListBody.children[1].classList.remove("no-selectedcard");
      this.$refs.cardListBody.children[2].classList.remove("no-selectedcard");
      this.cardIsRotate = [false,false,false];
      this.userCard = null;//用户当前页卡牌
      this.userCardCache = null;//用户卡牌
      this.cardPage = 1;//当前卡牌页码
      this.cardTotle = 0;//一共多少
      this.nowUserInfo = {
        tx:'',//头像地址
        score:0,//竞技点
        level:0,//等级
        cardCol:0,//收集卡牌
        nickName:''
      };//当前用户信息
      setTimeout(()=>{
        this.getCardList = ['','',''];
        this.seled = false;
      },800)
    },
    getDailyCard(Num){
      if(this.seled){
        return false;
      }
      if(!mailCheck(this.email)){
        this.$message.error('邮箱格式不正确！');
        return false;
      }
      console.log(Num);
      authApi.dailycard({email: this.email,sel:Num}).then(res => {
          console.log(res);
          let emailMD5 = md5(this.email);
          if(res.data.code==0){
            this.$message.error(res.data.msg);
          }else if(res.data.code==1){
            this.rememberEmail();
            let resData = res.data;
            let getCardSrcArr = ['/static/img/'+PrefixInteger(resData.cardChoiseList[0],4)+'.jpg','/static/img/'+PrefixInteger(resData.cardChoiseList[1],4)+'.jpg','/static/img/'+PrefixInteger(resData.cardChoiseList[2],4)+'.jpg'];
            showLoading();
            new Promise((resolve, reject)=>{
                loadingImg(getCardSrcArr,resolve, reject);
              }).then((result) => {
                hideLoading();
                this.seled = true;
                this.getUserCard(emailMD5,true);
                this.$set(this.getCardList, 0, getCardSrcArr[0]);
                this.$set(this.getCardList, 1, getCardSrcArr[1]);
                this.$set(this.getCardList, 2, getCardSrcArr[2]);
                this.$set(this.cardIsRotate, resData.choiseIndex, true);
                let leftGetChanceText = '';
                if(resData.leftGetChance>0){
                  leftGetChanceText = '抽卡成功，今天还剩余'+resData.leftGetChance+'次抽卡机会！';
                }else{
                  leftGetChanceText = '抽卡成功，这已经是您今天最后一次抽卡机会了！';
                }
                this.$message({
                  message: leftGetChanceText,
                  type: 'success'
                });
                this.getLog(1);
                for(let i=0;i<3;i++){
                  if(i!==resData.choiseIndex){
                    setTimeout(()=>{
                      this.$refs.cardListBody.children[i].classList.add("no-selectedcard");
                      this.restartDisabled = false;
                    },950);
                    setTimeout(()=>{
                      this.$set(this.cardIsRotate, i, true);
                    },800)
                  }
                }
            }).catch((reason)=> {
                console.log(reason);
                hideLoading();
                this.$message.error('图片资源加载失败');
            });
          }else if(res.data.code==2){
            this.$confirm('您尚未注册，是否进入注册页？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$router.push({
                path:'/reg',
                query: {
                  adr: btoa(this.email)
                }
              });
            }).catch(() => {
            });
          }else if(res.data.code==3){
            this.$message.error(res.data.msg);
            this.getUserCard(emailMD5,true);
          }
      })
    }
  }
}
</script>

