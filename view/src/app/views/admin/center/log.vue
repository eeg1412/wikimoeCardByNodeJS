<template>
<div class="wmcard_admincenter_common_right_body">
  <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column
      label="时间">
      <template slot-scope="scope">
        <span>{{scope.row.createTime | convertUTCTimeToLocalTime}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="text"
      label="内容">
    </el-table-column>
    <el-table-column
      prop="ip"
      label="IP">
    </el-table-column>
  </el-table>
  <el-pagination
    small
    layout="prev, pager, next"
    :total="totle"
    @current-change="pageChange"
    :current-page.sync="page"
    :page-size="20"
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
      totle:0,
    }
  },
  mounted() {
    this.getLogInfo();
  },
  filters:{
    convertUTCTimeToLocalTime(v){
      if(!v){
        return '-';
      }
      let date = new Date(v);
      var tt = [date.getFullYear(), ((date.getMonth()+1)<10?'0'+(date.getMonth()+1):date.getMonth()+1), (date.getDate()<10?'0'+date.getDate():date.getDate())].join('-') + '  ' +[(date.getHours()<10?'0'+date.getHours():date.getHours()), (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()), (date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds())].join(':');
      return tt;
      return time_;
    }
  },
  methods: {
    pageChange(p){
      this.page = p;
      this.getLogInfo();
    },
    getLogInfo(){
      let params = {
        token:this.token,
        page:this.page
      }
      authApi.adminSearchlog(params).then(res => {
        console.log(res);
        if(res.data.code==1){
          this.tableData = res.data.data;
          this.totle = res.data.total;
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
  },
}
</script>

