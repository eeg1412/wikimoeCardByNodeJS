<template>
<div class="wmcard_admincenter_common_right_body">
  <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column
      prop="email"
      label="邮箱">
    </el-table-column>
    <el-table-column
      prop="nickName"
      label="昵称">
    </el-table-column>
    <el-table-column
      prop="star"
      label="星星">
    </el-table-column>
    <el-table-column
      prop="score"
      label="竞技点">
    </el-table-column>
    <el-table-column
      prop="level"
      label="等级">
    </el-table-column>
    <el-table-column
      prop="exp"
      label="经验">
    </el-table-column>
    <el-table-column
      prop="deminingStarCount"
      label="累计挖矿">
    </el-table-column>
    <el-table-column
      prop="ip"
      label="IP">
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <el-button type="text" size="small" @click="banEmail(scope.row.ban,scope.row._id)">{{scope.row.ban?'解封':'封号'}}</el-button>
        <el-button type="text" size="small" @click="watchCard(scope.row.md5)">卡牌</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    small
    layout="prev, pager, next"
    :total="cardTotle"
    @current-change="cardPageChange"
    :current-page.sync="page"
    :page-size="5"
    class="wmcard_user_page">
  </el-pagination>
</div>
</template>

<script>
import {authApi} from "../../../api";
import {mailCheck} from "../../../../utils/utils";
export default {
  data() {
    return {
      tableData: [],
      token:sessionStorage.getItem("adminToken")?sessionStorage.getItem("adminToken"):localStorage.getItem("adminToken"),
      page:1,
      cardTotle:0,
    }
  },
  mounted() {
    this.getuserInfo();
  },
  methods: {
    cardPageChange(p){
      this.page = p;
      this.getuserInfo();
    },
    watchCard(md5){
      console.log(md5);
      let routeData = this.$router.resolve({
        name: "home",
        query: {md5:md5}
      });
      window.open(routeData.href, '_blank');
    },
    getuserInfo(){
      let params = {
        token:this.token,
        page:this.page
      }
      authApi.adminsearchuser(params).then(res => {
        console.log(res);
        if(res.data.code==1){
          this.tableData = res.data.data.data;
          this.cardTotle = res.data.data.total;
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
    banEmail(ban,id){
      let params = {
        token:this.token,
        id:id,
      }
      if(!ban){
        params['type'] = 'ban';
      }
      authApi.adminban(params).then(res => {
        console.log(res);
        if(res.data.code==1){
          this.$message({
            message: res.data.msg,
            type: 'success'
          });
          this.getuserInfo();
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
  },
}
</script>

