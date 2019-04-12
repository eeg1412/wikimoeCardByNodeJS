<template>
<div class="wmcard_admincenter_common_right_body">
  <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column
      prop="date"
      label="邮箱">
    </el-table-column>
    <el-table-column
      prop="name"
      label="昵称">
    </el-table-column>
    <el-table-column
      prop="address"
      label="星星">
    </el-table-column>
    <el-table-column
      prop="address"
      label="竞技点">
    </el-table-column>
    <el-table-column
      prop="address"
      label="等级">
    </el-table-column>
    <el-table-column
      prop="address"
      label="经验">
    </el-table-column>
    <el-table-column
      prop="address"
      label="累计挖矿">
    </el-table-column>
    <el-table-column
      prop="address"
      label="IP">
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <el-button type="text" size="small" @click="banEmail(scope.row)">封号</el-button>
        <el-button type="text" size="small">卡牌</el-button>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
import {authApi} from "../../../api";
import {mailCheck} from "../../../../utils/utils";
export default {
  data() {
    return {
      tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }],
      token:sessionStorage.getItem("adminToken")?sessionStorage.getItem("adminToken"):localStorage.getItem("adminToken")
    }
  },
  methods: {
    banEmail(){

    },
    onSubmit(){
      let star = Math.round(this.giveStar.star);
      let email = this.giveStar.email;
      if(isNaN(star)||star<=0){
          this.$message.error('请填入正确的数值！');
          return false;
      }
      if(!mailCheck(email)){
          this.$message.error('邮箱格式有误！');
          return false;
      }
      let params = {
        token:this.token,
        star:star,
        email:email
      }
      authApi.givestar(params).then(res => {
        console.log(res);
        if(res.data.code==1){
          this.$message({
            message: res.data.msg,
            type: 'success'
          });
        }else{
          this.$message.error(res.data.msg);
        }
      });
    }
  },
}
</script>

<style lang="stylus" scoped>
</style>
