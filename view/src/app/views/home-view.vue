<template>
<div class="common_body">
  <h5 class="wm_card_chiose_title">欢迎来到维基萌抽卡</h5>
  <div class="wm_card_email_body">
    <transition name="el-fade-in-linear">
      <div class="wm_card_email_input_body" v-show="!seled">
        <el-input v-model="email" placeholder="输入邮箱地址抽卡" class="wm_card_email">
            <el-select v-model="seledCardPackage" placeholder="选择卡包" class="wm_card_package_sel" slot="prepend">
              <el-option
                v-for="item in cardPackage.filter(item =>{return item.open})"
                :key="item.packageId"
                :label="item.name"
                :value="item.packageId">
              </el-option>
            </el-select>
        </el-input>
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
      <div class="card_list" :class="seled?'selectedcard':''" @click="getDailyCard(0)" @mouseover="$wikimoecard.l2dMassage(cardIsRotate[0]?'不知道这张卡你喜不喜欢。':'不知道能抽到什么卡呀！雷姆好期待呢！')">
        <rotate3DCard trigger="custom" v-model="cardIsRotate[0]" direction="row" :cardSrc="getCardList[0]">
          <slot name="cz"></slot>
          <slot name="cf"></slot>
        </rotate3DCard>
      </div>
      <div class="card_list" :class="seled?'selectedcard':''" @click="getDailyCard(1)" @mouseover="$wikimoecard.l2dMassage(cardIsRotate[1]?'不知道这张卡你喜不喜欢。':'不知道能抽到什么卡呀！雷姆好期待呢！')">
        <rotate3DCard trigger="custom" v-model="cardIsRotate[1]" direction="row" :cardSrc="getCardList[1]">
          <slot name="cz"></slot>
          <slot name="cf"></slot>
        </rotate3DCard>
      </div>
      <div class="card_list" :class="seled?'selectedcard':''" @click="getDailyCard(2)" @mouseover="$wikimoecard.l2dMassage(cardIsRotate[2]?'不知道这张卡你喜不喜欢。':'不知道能抽到什么卡呀！雷姆好期待呢！')">
        <rotate3DCard trigger="custom" v-model="cardIsRotate[2]" direction="row" :cardSrc="getCardList[2]">
          <slot name="cz"></slot>
          <slot name="cf"></slot>
        </rotate3DCard>
      </div>
    </div>
  </div>
  <topNews ref="topNews" />
  <div class="wm_user_info_body">
    <transition name="el-fade-in-linear">
      <div class="wm_mycard_list" v-if="userCard">
        <el-tooltip class="item" effect="dark" content="关闭信息" placement="top" :hide-after="3000">
          <div class="wm_mycard_list_close" @click="closeUserInfo"><i class="el-icon el-icon-close"></i></div>
        </el-tooltip>
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
              <th>收集量</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="wm_user_level">{{nowUserInfo.level}}</td>
            <td class="wm_user_score">{{nowUserInfo.score}}</td>
              <td class="wm_user_getcard_count">{{nowUserInfo.cardCol}}</td>
            </tr>
          </tbody>
        </table>
        <div class="mb15">
          <el-select v-model="userPackage" placeholder="选择卡包" class="wm_card_package_sel" @change="getUserCard(nowUserInfo.md5,false)">
            <el-option
              v-for="item in cardPackage"
              :key="item.packageId"
              :label="item.name"
              :value="item.packageId">
            </el-option>
          </el-select>
        </div>
        <div class="wm_market_card_datail_charts_empty" v-if="userCard.length<=0">
          <span>该卡包下没有卡牌</span>
        </div>
        <sequential-entrance delay="100" tag="div">
          <div v-for="(item,index) in userCard" v-bind:key="index+1" class="wm_getcard_box">
            <img class="wm_getcard_img" :src="$wikimoecard.url+item.packageId+'/'+item.cardId+'.jpg'" @click="openImg($wikimoecard.url+item.packageId+'/'+item.cardId+'.jpg')">
            <br>
            <span class="wm_card_nums">×{{userPackageNow[item.cardId]}}</span>
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
    </transition>
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
  <rank @watchInfo="watchRank"></rank>
  <div class="wm_card_get_list_body" v-if="logList.length>0" @mouseenter="$wikimoecard.l2dMassage('快来瞧瞧大家的动态吧！')">
    <h5 class="wm_card_chiose_title">最新动态</h5>
    <div class="wm_card_get_list_item_body">
      <transition-group name="el-fade-in-linear">
        <div class="wm_card_get_list_item" v-for="(item,index) in logList" v-bind:key="index+1">
          <div class="wm_card_get_list_avatar" @click="watchUserCard(item.md5)">
            <el-tooltip class="item" effect="dark" :content="'查看'+item.nickName+'的卡牌'" placement="top" :hide-after="3000">
              <img class="wm_card_get_list_avatar_pic" :src="'https://gravatar.loli.net/avatar/'+item.md5+'?s=100&amp;d=mm&amp;r=g&amp;d=robohash&days='+txDays" width="45" height="45">
            </el-tooltip>
          </div>
          <div class="wm_card_get_list_comment">
            <p>
              <span class="wm_log_name">{{item.nickName}}</span>
              <span class="wm_log_time">{{item.time|capitalize}}</span>
            </p>
            <p>
              <span v-if="item.type=='register'"
              >大家好，我是萌新{{item.nickName}}。初来乍到对什么都还很陌生，还恳请大家能够多多指导我怎么抽出六星卡！
              </span>
              <span v-else-if="item.type=='dailyCard'"
              >我抽中了出自作品《{{item.data.title}}》的{{item.data.star}}星卡<span class="wm_card_get_list_card_link" :class="item.data.star>=6?'wm_six_star_card_shake':''" @click="openImg($wikimoecard.url+item.data.packageId+'/'+item.data.cardId+'.jpg')">{{item.data.name}}</span>。
                {{item.data.star|cardStarText}}
              </span>
              <span v-else-if="item.type=='demining'"
              >我用{{item.data.pickaxe | pickaxeName}}在<span class="wm_card_get_list_card_link" @click="goMenu('/demining')">星星矿场</span>坐标【{{item.data.x+1}},{{item.data.y+1}}】处挖到了{{item.data.star}}颗星星，同时获得了{{item.data.exp}}点经验值！！请叫我专业的矿工！
              </span>
              <span v-else-if="item.type=='shop_1'"
              >我用{{item.data.star}}颗星星在<span class="wm_card_get_list_card_link" @click="goMenu('/star/shop')">星星商店</span>购买了{{item.data.times}}次抽卡机会，共抽中了<span class="wm_card_get_list_card_link" @click="openShopCard(item.data.card6,item.data.packageId)">{{item.data.card6.length}}</span>张六星卡、<span class="wm_card_get_list_card_link" @click="openShopCard(item.data.card5,item.data.packageId)">{{item.data.card5.length}}</span>张五星卡、<span class="wm_card_get_list_card_link" @click="openShopCard(item.data.card4,item.data.packageId)">{{item.data.card4.length}}</span>张四星卡、<span class="wm_card_get_list_card_link" @click="openShopCard(item.data.card3,item.data.packageId)">{{item.data.card3.length}}</span>张三星及其以下的卡。
              </span>
              <span v-else-if="item.type=='goen'"
              >我用{{item.data.goentama}}枚五円玉在<span class="wm_card_get_list_card_link" @click="goMenu('/goen')">结缘神社</span>结缘了{{item.data.times}}次，共结缘了<span class="wm_card_get_list_card_link" @click="openShopCard(item.data.card6,item.data.packageId)">{{item.data.card6.length}}</span>张六星卡、<span class="wm_card_get_list_card_link" @click="openShopCard(item.data.card5,item.data.packageId)">{{item.data.card5.length}}</span>张五星卡、<span class="wm_card_get_list_card_link" @click="openShopCard(item.data.card4,item.data.packageId)">{{item.data.card4.length}}</span>张四星卡、<span class="wm_card_get_list_card_link" @click="openShopCard(item.data.card3,item.data.packageId)">{{item.data.card3.length}}</span>张三星及其以下的卡。
              </span>
              <span v-else-if="item.type=='marketBuy'"
              >我用{{item.data.price}}颗星星在<span class="wm_card_get_list_card_link" @click="goMenu('/star/market/buycard')">星星交易市场</span>购买了出自作品《{{item.data.title}}》的{{item.data.star}}星卡<span class="wm_card_get_list_card_link" @click="openImg($wikimoecard.url+item.data.packageId+'/'+item.data.cardId+'.jpg')">{{item.data.name}}</span>。
              </span>
              <span v-else-if="item.type=='battle'"
              >我在<span class="wm_card_get_list_card_link" @click="goMenu('/battle')">卡牌对战</span>中<span v-if="item.data.win===1">战胜了</span><span v-else-if="item.data.win===0">败给了</span><span v-else>打平了</span><span class="wm_card_get_list_card_link" @click="watchUserCard(item.data.EmMD5)" v-if="item.data.EmMD5">{{item.data.EmName}}</span><span v-else>{{item.data.EmName}}</span>，<span v-if="item.data.win===1||item.data.win===0"><span v-if="item.data.win===1">共获得了</span><span v-else-if="item.data.win===0">失去了</span>{{Math.abs(item.data.getScore)}}点竞技点<span v-if="item.data.win===1">和{{item.data.getExp}}点经验值</span>。</span><span v-else>什么也没有获得。</span><span v-if="item.data.win===1">谁来与我大战三百回合？</span><span v-else-if="item.data.win===0">什么? 此地叫麦城！？</span><span v-else>真可惜，就差一点，下次一定要打赢这位大佬！</span>
              </span>
              <span v-else-if="item.type=='dec'"
              >我通过<span class="wm_card_get_list_card_link" @click="goMenu('/decompose')">卡牌分解</span>，用公式2NaAlO2+CO2+3H2O+{{item.data.cardNumCount}}张卡牌分解出了2Al(OH)3↓+Na2CO3+{{item.data.star}}颗星星！
              </span>
              <span v-else-if="item.type=='decItem'"
              >我通过<span class="wm_card_get_list_card_link" @click="goMenu('/decomposeitem')">道具分解</span>，用公式Cl2+2KI+{{item.data.shouldItemNum}}{{item.data.itemName}}分解出了2KCl+I2+{{item.data.getStar}}颗星星！
              </span>
              <span v-else-if="item.type=='upgradecard' && item.data.isSuccess"
              >我通过<span class="wm_card_get_list_card_link" @click="goMenu('/upgradecard')">卡牌升级</span>，成功将卡牌<span class="wm_card_get_list_card_link" @click="openImg($wikimoecard.url+item.data.packageId+'/'+item.data.cardId+'.jpg')">{{item.data.cardName}}</span>升级到了{{item.data.myCardLevel+1}}级。我感觉我已经天下无敌了呀！
              </span>
              <span v-else-if="item.type=='upgradecard' && !item.data.isSuccess"
              >我在<span class="wm_card_get_list_card_link" @click="goMenu('/upgradecard')">卡牌升级</span>中准备将<span class="wm_card_get_list_card_link" @click="openImg($wikimoecard.url+item.data.packageId+'/'+item.data.cardId+'.jpg')">{{item.data.cardName}}</span>升级到{{item.data.myCardLevel+2}}级的时候，升级失败了……我的卡牌和升级材料全部化作了{{item.data.getStar}}颗星星……
              </span>
              <span v-else-if="item.type=='dailyGetItem'"
              >{{item.data.msg}}。大家每天也不要忘记在<span class="wm_card_get_list_card_link" @click="goMenu('/dailygetitem')">签到系统</span>里白嫖……不对领取奖励哦！
              </span>
              <span v-else-if="item.type=='levelChange'"
              >我通过<span class="wm_card_get_list_card_link" @click="goMenu('/upgradecard')">卡牌等级转换</span>将<span class="wm_card_get_list_card_link" @click="openImg($wikimoecard.url+item.data.fromCardPackageId+'/'+item.data.fromCardId+'.jpg')">{{item.data.fromCardName}}</span>和<span class="wm_card_get_list_card_link" @click="openImg($wikimoecard.url+item.data.toCardPackageId+'/'+item.data.toCardId+'.jpg')">{{item.data.toCardName}}</span>的等级进行了对换。现在我的<span class="wm_card_get_list_card_link" @click="openImg($wikimoecard.url+item.data.fromCardPackageId+'/'+item.data.fromCardId+'.jpg')">{{item.data.fromCardName}}</span>变成了{{item.data.fromCardLevel+1}}级，<span class="wm_card_get_list_card_link" @click="openImg($wikimoecard.url+item.data.toCardPackageId+'/'+item.data.toCardId+'.jpg')">{{item.data.toCardName}}</span>变成了{{item.data.toCardLevel+1}}级。
              </span>
              <span v-else-if="item.type=='UCC'"
              >我在<span class="wm_card_get_list_card_link" @click="goMenu('/creatcard')">卡牌工坊</span>制作的{{item.data.star}}星卡牌——出自作品《{{item.data.title}}》的<span class="wm_card_get_list_card_link" @click="openImg($wikimoecard.url+item.data.packageId+'/'+item.data.cardId+'.jpg')">{{item.data.name}}</span>，通过了审核，获得了100颗星星的奖励！应该过不了多久大家就能抽到我制作的卡牌了吧！
              </span>
              <span v-else-if="item.type=='guesscard'"
              >我在<span class="wm_card_get_list_card_link" @click="goMenu('/star/guessCard/guess')">星星猜卡</span>中猜了<span class="wm_card_get_list_card_link" @click="openCardList(item.data.card)">这6张卡牌</span>，希望运气爆棚中个大奖，大家也快来一起猜卡吧，一夜暴富就在这一下！
              </span>
              <span v-else-if="item.type=='guesscardNoCard'"
              >我虽然在<span class="wm_card_get_list_card_link" @click="goMenu('/star/guessCard/guess')">星星猜卡</span>中没有猜中卡牌，但是我也获得了{{item.data.itemName}}×2，希望下次能中一个大奖！
              </span>
              <span v-else-if="item.type=='guesscardHaveCard'"
              >我在<span class="wm_card_get_list_card_link" @click="goMenu('/star/guessCard/guess')">星星猜卡</span>中猜中了{{item.data.attackCount}}张卡牌，获得了<span class="wm_card_get_list_card_link" @click="openCardList(item.data.attackCardInfoArr)">猜中的卡牌</span>和{{item.data.getStar}}颗星星！
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
import topNews from '../components/topNews.vue';
import userTop from '../components/topUserInfo.vue';
import rank from '../components/rank.vue';
import md5 from 'js-md5';
export default {
  data() {
    return {
      userPackage:'0',
      userCardCountNow:{},
      seledCardPackage:'加载中',
      cardPackage:[],
      txDays:new Date().getDate(),
      token:sessionStorage.getItem("token")?sessionStorage.getItem("token"):localStorage.getItem("token"),
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
      userCardCount:{},
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
    menuView,
    topNews,
    userTop,
    rank
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
  watch:{
    $route(to,from){
      if(to.query.md5){
        this.urlUserInfo();
      }
    }
  },
  mounted() {
    this.getRememberEmail();
    this.getLog(1);
    this.setCardScroll();
    this.urlUserInfo();
    this.getCardPackage();
  },
  methods: {
    getCardPackage(){
      authApi.searchcardpackage().then(res => {
          console.log(res);
          if(res.data.code==0){
            this.$message.error(res.data.msg);
          }else if(res.data.code==1){
            this.cardPackage = res.data.data;
            let nowPackageId = localStorage.getItem("dailyCardPackageId") || '0';
            this.seledCardPackage = '0';
            for(let i=0;i<this.cardPackage.length;i++){
              if(this.cardPackage[i].packageId===nowPackageId){
                if(this.cardPackage[i].open){
                  this.seledCardPackage = nowPackageId;
                }
                break;
              }
            }
          }
      });
    },
    watchRank(md5){
      this.watchUserCard(md5);
    },
    closeUserInfo(){
      this.userCard = null;
      this.userCardCache = null;
      this.userPackage = '0';
      this.userCardCountNow = {};
    },
    openCardList(cardArr){
      if(cardArr.length<1){
        return false;
      }
      let shopImgHTML = '';
      for(let i=0;i<cardArr.length;i++){
        shopImgHTML = shopImgHTML+'<div class="watch_shop_img"><img src="'+this.$wikimoecard.url+cardArr[i].packageId+'/'+cardArr[i].cardId+'.jpg'+'" /></div>';
      }
      this.$alert('<div class="watch_shop_body">'+shopImgHTML+'</div>', '查看卡牌', {
        dangerouslyUseHTMLString: true,
        customClass:'watchShopAlert'
      });
    },
    openShopCard(cardArr,packageId){
      if(cardArr.length<1){
        return false;
      }
      let shopImgHTML = '';
      for(let i=0;i<cardArr.length;i++){
        shopImgHTML = shopImgHTML+'<div class="watch_shop_img"><img src="'+this.$wikimoecard.url+packageId+'/'+cardArr[i]+'.jpg'+'" /></div>';
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
              if(logListData[i].type=='shop_1'||logListData[i].type=='goen'){//判断是否为商店
                let shopCardData = logListData[i].data.card;
                let card3 = [];
                let card4 = [];
                let card5 = [];
                let card6 = [];
                for(let j=0;j<shopCardData.length;j++){
                  if(Number(shopCardData[j][0])<=3){//三星卡及其以下
                    card3.push(shopCardData[j][1]);
                  }else if(Number(shopCardData[j][0])==4){//四星卡
                    card4.push(shopCardData[j][1]);
                  }else if(Number(shopCardData[j][0])==5){//五星卡
                    card5.push(shopCardData[j][1]);
                  }else if(Number(shopCardData[j][0])==6){//六星卡
                    card6.push(shopCardData[j][1]);
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
        dangerouslyUseHTMLString: true,
        lockScroll:false
      });
    },
    logPageChange(val){
      this.getLog(val);
    },
    cardPageChange(val,noGoTop){
      let userCard_ = this.userCardCache.slice((val-1)*20,val*20);
      let userCardSrc = [];
      for(let i = 0;i<userCard_.length;i++){
        let userCardSrcItem = this.$wikimoecard.url+this.userPackage+'/'+userCard_[i].cardId+'.jpg';
        userCardSrc.push(userCardSrcItem);
      }
      showLoading();
      new Promise((resolve, reject)=>{
        loadingImg(userCardSrc,resolve, reject);
      }).then((result) => {
          this.userCard=null;
          setTimeout(()=>{
            if(!noGoTop){
              let topNewsHeight = this.$refs.topNews.$el.clientHeight?this.$refs.topNews.$el.clientHeight+20:0;
              let windowWidth = window.screen.width;
              let topSet = 450;
              if(windowWidth<=768){
                topSet = 410;
              }
              scrollToTop(topSet+topNewsHeight,200);
            }
            hideLoading();
            this.userPackageNow = {...this.userCardCount};
            this.userCard = userCard_;
          },250);
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
      authApi.searchcard({md5: md5,packageId:this.userPackage}).then(res => {
          console.log(res);
          if(res.data.code==0){
            this.$message.error(res.data.msg);
          }else if(res.data.code==1){
            let resData = res.data;
            if(resData.cardIndexCount>0){
              this.userCardCache = res.data.card||[];
              this.userCardCache = this.userCardCache.sort((a,b)=>{
                if(b.star!=a.star){
                  return b.star-a.star;
                }else{
                  return b.cardId-a.cardId;
                }
              })
              this.cardPage = 1;
              this.cardTotle = this.userCardCache.length;
              this.cardPageChange(1,noGoTop);
              this.userCardCount = res.data.cardCount;
              this.nowUserInfo = {
                tx:'https://gravatar.loli.net/avatar/'+resData.md5+'?s=100&d=mm&r=g&d=robohash&days='+this.txDays,//头像地址
                score:resData.score,//竞技点
                level:resData.level,//等级
                cardCol:resData.cardIndexCount,//收集卡牌
                nickName:resData.nickName,
                cardCount:resData.cardCount,
                md5:resData.md5
              };//当前用户信息
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
      // this.userCard = null;//用户当前页卡牌
      // this.userCardCache = null;//用户卡牌
      // this.cardPage = 1;//当前卡牌页码
      // this.cardTotle = 0;//一共多少
      // this.nowUserInfo = {
      //   tx:'',//头像地址
      //   score:0,//竞技点
      //   level:0,//等级
      //   cardCol:0,//收集卡牌
      //   nickName:''
      // };//当前用户信息
      setTimeout(()=>{
        this.getCardList = ['','',''];
        this.seled = false;
      },800)
    },
    rememberPackageId(){
      const packageId = this.seledCardPackage;
      localStorage.setItem("dailyCardPackageId",packageId);
    },
    getDailyCard(Num){
      if(this.seled){
        return false;
      }
      if(!mailCheck(this.email)){
        this.$message.error('邮箱格式不正确！');
        return false;
      }
      this.rememberPackageId();
      console.log(Num);
      authApi.dailycard({email: this.email,sel:Num,packageId:this.seledCardPackage}).then(res => {
          console.log(res);
          let emailMD5 = md5(this.email);
          if(res.data.code==0){
            this.$message.error(res.data.msg);
          }else if(res.data.code==1){
            this.rememberEmail();
            let resData = res.data;
            let getCardSrcArr = [this.$wikimoecard.url+resData.packageId+'/'+resData.cardChoiseList[0]+'.jpg',this.$wikimoecard.url+resData.packageId+'/'+resData.cardChoiseList[1]+'.jpg',this.$wikimoecard.url+resData.packageId+'/'+resData.cardChoiseList[2]+'.jpg'];
            showLoading();
            new Promise((resolve, reject)=>{
                loadingImg(getCardSrcArr,resolve, reject);
              }).then((result) => {
                hideLoading();
                this.seled = true;
                // this.getUserCard(emailMD5,true);
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
            this.rememberEmail();
            this.getUserCard(emailMD5,true);
          }
      })
    }
  }
}
</script>

