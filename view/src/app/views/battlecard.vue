<template>
    <div class="common_body">
        <userTop ref="userTop" />
        <h5 class="common_title type_shop">设置出战卡牌</h5>
        <div class="wm_battlecard_body">
            <div>
                <table class="wm_user_info_table">
                <thead>
                    <tr>
                        <th>攻</th>
                        <th>防</th>
                        <th>速</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td class="wm_user_level">0</td>
                    <td class="wm_user_score">0</td>
                    <td class="wm_user_getcard_count">0</td>
                    </tr>
                </tbody>
                </table>
            </div>
            <div class="wm_battlecard_list_body">
                <div class="wm_battlecard_list_box" v-for="(item,index) in myCard" v-bind:key="index+1">
                    <div class="wm_battlecard_list_number">{{index+1}}</div>
                    <div></div>
                </div>
            </div>
        </div>
        <div class="wm_battlecard_btn_body">
            <el-button>返回对战</el-button>
            <el-button type="primary">保存卡组</el-button>
            <el-button type="info">配卡说明</el-button>
        </div>
        <menuView></menuView>
    </div>
</template>

<script>
import menuView from '../components/menu.vue';
import {authApi} from "../api";
import userTop from '../components/topUserInfo.vue';

export default {
  data() {
    return {
        token:sessionStorage.getItem("token")?sessionStorage.getItem("token"):localStorage.getItem("token"),
        myCard:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]
    }
  },
  components: {
    menuView,
    userTop,
  },
}
</script>

<style scoped>
.wm_battlecard_btn_body{
    padding: 20px 0;
    text-align: center;
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
}
.wm_battlecard_list_number{
    line-height: 253px;
    font-size: 36px;
    color: #ccc;
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
