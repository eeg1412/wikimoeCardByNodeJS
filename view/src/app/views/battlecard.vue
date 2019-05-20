<template>
    <div class="common_body">
        <userTop ref="userTop" />
        <h5 class="common_title type_shop">设置出战卡牌</h5>
        <div id="battlecardTable">
            <table class="wm_user_info_table type_battlecard">
            <thead>
                <tr>
                    <th>攻</th>
                    <th>防</th>
                    <th>速</th>
                    <th>SAN</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><span v-show="selIndex!==null" :class="{'cGreen1A7':ifADSHPSUM[0]<0,'cRed':ifADSHPSUM[0]>0}">{{ifADSHPSUM[0]>=0?'+':''}}{{ifADSHPSUM[0]}}<br /></span>{{ADSHP[0]}}</td>
                    <td><span v-show="selIndex!==null" :class="{'cGreen1A7':ifADSHPSUM[1]<0,'cRed':ifADSHPSUM[1]>0}">{{ifADSHPSUM[1]>=0?'+':''}}{{ifADSHPSUM[1]}}<br /></span>{{ADSHP[1]}}</td>
                    <td><span v-show="selIndex!==null" :class="{'cGreen1A7':ifADSHPSUM[2]<0,'cRed':ifADSHPSUM[2]>0}">{{ifADSHPSUM[2]>=0?'+':''}}{{ifADSHPSUM[2]}}<br /></span>{{ADSHP[2]}}</td>
                    <td><span v-show="selIndex!==null" :class="{'cGreen1A7':ifADSHPSUM[3]<0,'cRed':ifADSHPSUM[3]>0}">{{ifADSHPSUM[3]>=0?'+':''}}{{ifADSHPSUM[3]}}<br /></span>{{ADSHP[3]}}</td>
                </tr>
            </tbody>
            </table>
        </div>
        <div class="wm_battlecard_table_fixed_body" v-show="fixedTable">
            <div class="wm_battlecard_table_fixed_box">
                <table class="wm_user_info_table type_battlecard">
                <thead>
                    <tr>
                        <th>攻</th>
                        <th>防</th>
                        <th>速</th>
                        <th>SAN</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><span v-show="selIndex!==null" :class="{'cGreen1A7':ifADSHPSUM[0]<0,'cRed':ifADSHPSUM[0]>0}">{{ifADSHPSUM[0]>=0?'+':''}}{{ifADSHPSUM[0]}}<br /></span>{{ADSHP[0]}}</td>
                        <td><span v-show="selIndex!==null" :class="{'cGreen1A7':ifADSHPSUM[1]<0,'cRed':ifADSHPSUM[1]>0}">{{ifADSHPSUM[1]>=0?'+':''}}{{ifADSHPSUM[1]}}<br /></span>{{ADSHP[1]}}</td>
                        <td><span v-show="selIndex!==null" :class="{'cGreen1A7':ifADSHPSUM[2]<0,'cRed':ifADSHPSUM[2]>0}">{{ifADSHPSUM[2]>=0?'+':''}}{{ifADSHPSUM[2]}}<br /></span>{{ADSHP[2]}}</td>
                        <td><span v-show="selIndex!==null" :class="{'cGreen1A7':ifADSHPSUM[3]<0,'cRed':ifADSHPSUM[3]>0}">{{ifADSHPSUM[3]>=0?'+':''}}{{ifADSHPSUM[3]}}<br /></span>{{ADSHP[3]}}</td>
                    </tr>
                </tbody>
                </table>
            </div>
        </div>
        <el-collapse-transition>
            <div class="wm_battlecard_body" v-show="selIndex===null">
                <div class="wm_battlecard_list_body">
                    <draggable v-model="myCard" @change="change" handle=".handle">
                        <div class="wm_battlecard_list_box" v-for="(item,index) in myCard" v-bind:key="index+1" @click="selcard(index)">
                            <div class="wm_battlecard_list_move handle"><i class="el-icon-s-grid"></i></div>
                            <div class="wm_battlecard_list_number">{{index+1}}</div>
                            <div v-if="item!==null"><img class="wm_getcard_img" :src="'/static/img/'+PrefixInteger_(item,4)+'.jpg'"></div>
                        </div>
                    </draggable>
                </div>
            </div>
        </el-collapse-transition>
        <div class="wm_battlecard_usercard" v-show="selIndex!==null">
            <div class="wm_cardlist_select_search_body">
                <el-form :inline="true" :model="searchForm">
                    <el-form-item label="星星等级">
                        <el-select class="wm_cardlist_select" @change="searchChanged" v-model="searchForm.star" placeholder="筛选星级">
                        <el-option label="全部" value="0"></el-option>
                        <el-option label="1星" value="1"></el-option>
                        <el-option label="2星" value="2"></el-option>
                        <el-option label="3星" value="3"></el-option>
                        <el-option label="4星" value="4"></el-option>
                        <el-option label="5星" value="5"></el-option>
                        <el-option label="6星" value="6"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="水晶属性">
                        <el-select class="wm_cardlist_select" @change="searchChanged" v-model="searchForm.cry" placeholder="筛选水晶属性">
                        <el-option label="全部" value="0"></el-option>
                        <el-option label="红火" value="1"></el-option>
                        <el-option label="蓝水" value="2"></el-option>
                        <el-option label="绿风" value="3"></el-option>
                        <el-option label="光" value="4"></el-option>
                        <el-option label="暗" value="5"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="被动属性">
                        <el-select class="wm_cardlist_select" @change="searchChanged" v-model="searchForm.leftType" placeholder="筛选被动属性">
                        <el-option label="全部" value="0"></el-option>
                        <el-option label="全能" value="1"></el-option>
                        <el-option label="兵攻" value="2"></el-option>
                        <el-option label="盾防" value="3"></el-option>
                        <el-option label="速度" value="4"></el-option>
                        <el-option label="爱心" value="5"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="主动技能">
                        <el-select class="wm_cardlist_select" @change="searchChanged" v-model="searchForm.rightType" placeholder="筛选主动技能">
                        <el-option label="全部" value="0"></el-option>
                        <el-option label="物" value="1"></el-option>
                        <el-option label="魔" value="2"></el-option>
                        <el-option label="防" value="3"></el-option>
                        <el-option label="治" value="4"></el-option>
                        <el-option label="妨" value="5"></el-option>
                        <el-option label="支" value="6"></el-option>
                        <el-option label="特" value="7"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <el-collapse-transition>
                <div class="wm_mycard_list" v-if="userCard.length>0">
                    <div class="wm_market_mycard_item type_mobile" v-for="(item,index) in userCard" v-bind:key="index" :class="ifIndex===index?'card_sel_pikapika':''" @click="seledCard(index)">
                        <img class="wm_getcard_img" :src="'/static/img/'+PrefixInteger_(item[0],4)+'.jpg'">
                    </div>
                </div>
                <div class="wm_battlecard_nocard" v-if="userCard.length<=0&&!pageChangeing">您目前还没有这些卡牌呢！快去抽卡！</div>
            </el-collapse-transition>
            <div class="wm_market_content_page" v-if="userCard.length>0">
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
        </div>
        <div class="wm_battlecard_btn_body">
            <el-button @click="back();">返回</el-button>
            <el-button type="primary" v-show="selIndex===null" @click="saveCard">保存</el-button>
            <el-button type="info" @click="openTips">说明</el-button>
        </div>
        <menuView></menuView>
    </div>
</template>

<script>
import menuView from '../components/menu.vue';
import {PrefixInteger,md5Check,scrollToTop} from "../../utils/utils";
import {authApi} from "../api";
import userTop from '../components/topUserInfo.vue';
import md5_ from 'js-md5';
import cardData from '../../utils/cardData.json';
import draggable from 'vuedraggable'

export default {
  data() {
    return {
        fixedTable:false,
        ifIndex:null,//当前暂时选择的卡
        ifADSHPSUM:[0,0,0,0],//暂时卡组的增减差
        token:sessionStorage.getItem("token")?sessionStorage.getItem("token"):localStorage.getItem("token"),
        myCard:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
        myCardIndex:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
        haveCard:[],
        selIndex:null,
        userCardCache:null,
        cardPage:1,
        cardTotle:0,
        userCard:[],
        pageChangeing:false,
        ADSHP:[0,0,0,0],
        searchForm:{
            star:'0',
            cry:'0',
            rightType:'0',
            leftType:'0'
        }
    }
  },
  components: {
    menuView,
    userTop,
    draggable
  },
  created() {
    this.getMyBattleCard();
  },
  mounted() {
    window.addEventListener('scroll', this.tableFixed);
  },
  methods: {
    tableFixed(){
        let el = document.getElementById('battlecardTable');
        if(!el){
            return false;
        }
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        let offsetTop = el.offsetTop;
        scrollTop > offsetTop ? this.fixedTable = true : this.fixedTable = false;
    },
    change(data){
        console.log(data);
        let newIndex = data.moved.newIndex;
        let oldIndex = data.moved.oldIndex;
        let oldCardIndex = this.myCardIndex[oldIndex];
        if(newIndex>oldIndex){
            console.log('新比旧大');
            this.myCardIndex.splice(newIndex+1, 0, oldCardIndex);
            this.myCardIndex.splice(oldIndex, 1);
        }else{
            this.myCardIndex.splice(newIndex, 0, oldCardIndex);
            this.myCardIndex.splice(oldIndex+1, 1);
        }
        console.log(this.myCardIndex);
    },
    openTips(){
      this.$alert('<div class="watch_tips"><img src="/static/otherImg/battletips.png" /></div>', '配卡说明', {
        dangerouslyUseHTMLString: true,
        lockScroll:false
      });
    },
    saveCard(){
        let params = {
            token:this.token,
            type:'save',
            card:this.myCard
        }
        authApi.battlecard(params).then(res => {
            console.log(res);
            if(res.data.code==0){
                this.$message.error(res.data.msg);
            }else if(res.data.code==1){
                this.$message({
                    message:res.data.msg,
                    type: 'success'
                });
            }
        });
    },
    sumADSHP(cardArr){
        let cardData_ = cardData['cardData'];
        let myCardInfo = [];
        let cardList = cardArr;
        for(let i=0;i<cardList.length;i++){
            if(cardList[i]!==null){
                let cardInfo = cardData_[PrefixInteger(cardList[i],4)];
                myCardInfo.push(cardInfo);
            }
        }
        if(myCardInfo.length>0){
            let cardArr = myCardInfo;
            let starArr = [0,0,0,0,0,0];
            let starCount = 0;
            let cryArr = [0,0,0,0,0];
            for(let i =0;i<cardArr.length;i++){
                let star = cardArr[i].star-1;
                starArr[star] = starArr[star]+1;
                starCount = starCount + star+1;
                let cry = cardArr[i].cry-1;
                cryArr[cry] = cryArr[cry]+1;
            }
            let x = starCount;//初始化x为星星的数量
            // 如果是1、2、3、4、5、6顺子排列的卡牌则攻击力和防御力和血的x+20
            let minStarCount = Math.min.apply(null, starArr);
            let cardCountPlus = 0;
            if(this.userCardCache){
                cardCountPlus = Math.floor(this.userCardCache.length/50);//每50收集率x+1
            }
            x = x + minStarCount*20+cardCountPlus;
            // 每三种同属性的卡牌攻击力和防御力和血的x+1
            for(let i=0;i<cryArr.length;i++){
                let cryPlusX = Math.floor(cryArr[i]/3);
                x = x + cryPlusX;
            }
            // 攻击=x*100 防=x*50 血=x*200
            let A = x*100;
            let D = x*50;
            let HP = x*500;
            // 设置速度
            let S = 0;
            for(let j =0;j<cardArr.length;j++){
                //速4
                let leftType = cardArr[j].leftType;
                if(leftType===4){
                    S = S+1;
                }else if(leftType===1){//全1
                    A = A + 50;
                    D = D + 25;
                }else if(leftType===2){//兵2
                    A = A + 100;
                }else if(leftType===3){//盾3
                    D = D + 50;
                }else if(leftType===5){//爱5
                    HP = HP + 500;
                }  
            }
            return [A,D,S,HP];
        }else{
            return [0,0,0,0];
        }
    },
    seledCard(i){
        if(i===this.ifIndex){
            this.myCard[this.selIndex] = this.userCard[i][0];
            let mycardIndex_ = this.myCardIndex[this.selIndex];
            if(mycardIndex_!==null){
                this.userCardCache[mycardIndex_][2] = true;
            }
            this.myCardIndex[this.selIndex] = this.userCard[i][3];
            this.selIndex = null;
            this.userCardCache[this.userCard[i][3]][2] = false;
            this.ADSHP = this.sumADSHP(this.myCard);
            this.restIf();
        }else{
            this.ifIndex = i;
            let cardCache = [...this.myCard];
            cardCache[this.selIndex] = this.userCard[i][0];
            let ifADSHP = this.sumADSHP(cardCache);
            for(let i=0;i<ifADSHP.length;i++){
                this.ifADSHPSUM[i] = ifADSHP[i] - this.ADSHP[i];
            }
        }
    },
    restIf(){
        this.ifIndex = null;
        this.ifADSHPSUM = [0,0,0,0]
    },
    selcard(i){
      this.cardPage = 1;
      this.cardPageChange(1);
      this.selIndex = i;
      scrollToTop(0,200);
    },
    PrefixInteger_(num,length){
      return PrefixInteger(num,length);
    },
    searchChanged(){
        this.restIf();
        this.cardPage = 1;
        this.cardPageChange(1);
    },
    cardPageChange(val){
      this.pageChangeing = true;
      this.userCard = [];
      let that = this;
      // 筛选条件
      function setStar(item){
          let p_ = that.searchForm.star;
          if(p_==='0'){
              return true;
          }else if(item==p_){
              return true;
          }
          return false;
      }
      function setCry(item){
          let p_ = that.searchForm.cry;
          if(p_==='0'){
              return true;
          }else if(item==p_){
              return true;
          }
          return false;
      }
      function setRightType(item){
          let p_ = that.searchForm.rightType;
          if(p_==='0'){
              return true;
          }else if(item==p_){
              return true;
          }
          return false;
      }
      function setLeftType(item){
          let p_ = that.searchForm.leftType;
          if(p_==='0'){
              return true;
          }else if(item==p_){
              return true;
          }
          return false;
      }
      let userCardSearchRes = this.userCardCache.filter(item => item[2] && setStar(item[4].star) && setCry(item[4].cry) && setRightType(item[4].rightType) && setLeftType(item[4].leftType));
      let userCard_ = userCardSearchRes.slice((val-1)*20,val*20);
      this.cardTotle = userCardSearchRes.length;
      setTimeout(()=>{
        this.userCard = userCard_;
        this.pageChangeing = false;
      },300)
    },
    getMyBattleCard(){
        let params = {
            token:this.token,
            type:'search'
        }
        authApi.battlecard(params).then(res => {
            console.log(res);
            if(res.data.code==0){
                this.$message.error(res.data.msg);
            }else if(res.data.code==1){
                if(res.data.data.length===20){
                    this.myCard = res.data.data;
                }
                this.getMycard();
            }
        });
    },
    getMycard(){
        if(!this.token){
            this.$router.replace({ path:'/'});
        }
        let tokenUserInfo = this.token.split('.')[1];
        let email = JSON.parse(atob(tokenUserInfo)).email;
        let md5 = md5_(email);
        if(!md5Check(md5)){
            this.$message.error('用户信息有误！');
            return false;
        }
        authApi.searchcard({md5: md5}).then(res => {
            if(res.data.code==0){
                this.$message.error(res.data.msg);
            }else if(res.data.code==1){
                let resData = res.data;
                if(res.data.card){
                    this.userCardCache = Object.entries(res.data.card);
                    this.userCardCache.reverse();
                    for(let i=0;i<this.userCardCache.length;i++){
                        this.userCardCache[i][2] = true;
                        // 筛选卡牌是否已经有了
                        for(let j=0;j<this.myCard.length;j++){
                            if(this.myCard[j]===null){
                                break
                            }else{
                                if(this.userCardCache[i][0]===this.myCard[j]){
                                    this.userCardCache[i][2] = false;
                                    this.myCardIndex[j] = i;
                                }
                            }
                        }
                        this.userCardCache[i][3] = i;
                        let cardData_ = cardData['cardData'];//卡牌信息
                        this.userCardCache[i][4] = cardData_[PrefixInteger(this.userCardCache[i][0],4)];//输入卡牌信息
                    }
                    // 0卡牌id、1卡牌数量、2卡牌是否已选、3卡牌index、4卡牌信息
                    this.cardPage = 1;
                    this.ADSHP = this.sumADSHP(this.myCard);
                    this.cardPageChange(1);
                }else{
                    this.$message({
                        message: resData.nickName+'还没有获得过卡牌呢！',
                        type: 'warning'
                    });
                }
            }
        });
    },
    back(){
        if(this.selIndex===null){
            this.$router.push({
                path:'/battle'
            });
        }else{
            this.selIndex = null;
        }
    },
  },
  beforeDestroy(){
    window.removeEventListener('scroll', this.tableFixed);
  }
}
</script>

<style scoped>
.wm_user_info_table.type_battlecard th{
    width: 25%;
}
.wm_user_info_table.type_battlecard td{
    width: 25%;
}
.wm_battlecard_btn_body{
    padding: 20px 0;
    text-align: center;
    background-color: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 999;
}
.wm_battlecard_body{
    text-align: center;
}
.wm_battlecard_list_box{
    cursor: url(/static/cur/pointer.cur),pointer;
    margin: 5px;
    display: inline-block;
    text-align: center;
    width: 180px;
    height: 253px;
    border-radius: 4px;
    border: 1px dashed #ccc;
    position: relative;
}
.wm_battlecard_list_number{
    line-height: 253px;
    font-size: 36px;
    position: absolute;
    left: 1px;
    right: 1px;
    top: 1px;
    bottom: 1px;
    color: #ccc;
    text-shadow: #fff 1px 0 0, #fff 0 1px 0, #fff -1px 0 0, #fff 0 -1px 0;
    opacity: 0.8;
    z-index: 2;
}
.wm_battlecard_nocard{
    padding:50px 0;
    text-align: center;
}
.wm_battlecard_list_move{
    position: absolute;
    background: #fff;
    width: 20px;
    height: 20px;
    line-height: 20px;
    right: 5px;
    bottom: 5px;
    border-radius: 3px;
    cursor: url(/static/cur/move.cur),move;
    color: #4f4f4f;
    z-index: 3;
}
.wm_battlecard_table_fixed_body{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 10;
    background: #fff;
    padding: 60px 10px 0px 10px;
    box-shadow: 0 0 5px rgba(0,0,0,.3);
}
.wm_battlecard_table_fixed_box{
    margin: 0 auto;
    width: 100%;
    max-width: 980px;
}
@media (max-width: 768px){
    .wm_battlecard_list_box{
        width: 88px;
        height: 124px;
    }
    .wm_battlecard_list_number{
        line-height: 124px;
    }
}
</style>
