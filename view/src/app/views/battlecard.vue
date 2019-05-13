<template>
    <div class="common_body">
        <userTop ref="userTop" />
        <h5 class="common_title type_shop">设置出战卡牌</h5>
        <el-collapse-transition>
            <div class="wm_battlecard_body" v-show="selIndex===null">
                <div>
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
                        <td class="wm_user_level">{{ADSHP[0]}}</td>
                        <td class="wm_user_score">{{ADSHP[1]}}</td>
                        <td class="wm_user_getcard_count">{{ADSHP[2]}}</td>
                        <td class="wm_user_getcard_count">{{ADSHP[3]}}</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
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
            <el-collapse-transition>
                <div class="wm_mycard_list" v-if="userCard.length>0">
                    <div class="wm_market_mycard_item type_mobile" v-for="(item,index) in userCard" v-bind:key="index" @click="seledCard(index)">
                        <img class="wm_getcard_img" :src="'/static/img/'+PrefixInteger_(item[0],4)+'.jpg'">
                    </div>
                </div>
                <div class="wm_battlecard_nocard" v-if="userCard.length<=0&&!pageChangeing">您目前还没有卡牌呢！快去抽卡！</div>
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
        ADSHP:[0,0,0,0]
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
  methods: {
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
    sumADSHP(){
        let cardData_ = cardData['cardData'];
        let myCardInfo = [];
        for(let i=0;i<this.myCard.length;i++){
            if(this.myCard[i]!==null){
                let cardInfo = cardData_[PrefixInteger(this.myCard[i],4)];
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
            x = x + minStarCount*20;
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
                    HP = HP + 250;
                }  
            }
            this.ADSHP = [A,D,S,HP];
        }
    },
    seledCard(i){
        this.myCard[this.selIndex] = this.userCard[i][0];
        let mycardIndex_ = this.myCardIndex[this.selIndex];
        if(mycardIndex_!==null){
            this.userCardCache[mycardIndex_][2] = true;
        }
        this.myCardIndex[this.selIndex] = this.userCard[i][3];
        this.selIndex = null;
        this.userCardCache[this.userCard[i][3]][2] = false;
        this.sumADSHP();
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
    cardPageChange(val){
      this.pageChangeing = true;
      this.userCard = [];
      let userCard_ = this.userCardCache.filter(item => item[2]).slice((val-1)*20,val*20);
      this.cardTotle = this.userCardCache.filter(item => item[2]).length;
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
                    }
                    // 0卡牌id、1卡牌数量、2卡牌是否已选、3卡牌index
                    this.cardPage = 1;
                    this.sumADSHP();
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
