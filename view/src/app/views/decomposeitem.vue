<template>
    <div class="common_body">
        <userTop ref="userTop" />
        <decomposehead />
        <div class="wm_market_content_body type_dec">
            <h5 class="common_title type_shop type_dec">道具分解</h5>
            <div class="wm_dec_item_list">
                <div class="wm_market_tips" v-if="myItem.length<=0">您暂时没有可以分解的道具！</div>
                <el-row :gutter="20" v-else>
                    <el-col class="tc mb20" :md="6" :sm="12" :xs="24" v-for="(item,index) in myItem" v-bind:key="index" v-show="item[1]>0">
                        <el-card class="box-card">
                            <div class="mb10"><img :src="'/static/otherImg/item/'+item[0]+'.png'" height="32px" width="32px" /></div>
                            <div class="mb20">{{itemData_[item[0]].name}}</div>
                            <div class="mb5">需要：1000</div>
                            <div class="mb5">持有：{{item[1]}}</div>
                            <div class="mb20">满足条件可分解成270颗星星</div>
                            <el-button type="primary" @click="decomposeitem(item[0])" :disabled="item[1]<1000">分解</el-button>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </div>
        <menuView></menuView>
    </div>
</template>

<script>
import {PrefixInteger} from "../../utils/utils";
import menuView from '../components/menu.vue';
import {authApi} from "../api";
import userTop from '../components/topUserInfo.vue';
import decomposehead from "../components/decomposehead";
import itemData from '../../../../server/data/item';

export default {
  data() {
    return {
        token:sessionStorage.getItem("token")?sessionStorage.getItem("token"):localStorage.getItem("token"),
        myItem:[],
        itemData_:itemData
    }
  },
  components: {
    menuView,
    userTop,
    decomposehead
  },
  created() {
      this.searchuseritem();
  },
  mounted() {
      this.$emit('l2dMassage','这里可以分解多余的道具，但是感觉很不值得。');
  },
  methods: {
    decomposeitem(itemId){
        this.$confirm('分解将会消耗道具，是否继续?', '提示', {
            confirmButtonText: '分解',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            let params = {
                token:this.token,
                itemId:itemId
            }
            authApi.decomposeitem(params).then(res => {
                console.log(res);
                if(res.data.code==0){
                    this.$message.error(res.data.msg);
                }else if(res.data.code==1){
                    this.$message({
                        message: '分解成功，获得'+res.data.getStar+'颗星星！',
                        type: 'success'
                    });
                    this.searchuseritem();
                    this.$refs.userTop.getUserInfo();
                }
            });
        }).catch(() => {         
        });
    },
    searchuseritem(){
        let params = {
            token:this.token
        }
        authApi.searchuseritem(params).then(res => {
            console.log(res);
            if(res.data.code==0){
                this.$message.error(res.data.msg);
            }else if(res.data.code==1){
                if(res.data.data){
                    this.myItem = Object.entries(res.data.data);
                }
            }
        });
    },
  }
}
</script>

<style scoped>
.wm_dec_item_list{
    margin-top: 20px;
}
</style>
