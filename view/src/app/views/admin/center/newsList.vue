<template>
<div class="wmcard_admincenter_common_right_body">
  <div class="clearfix"><el-button class="fr" type="primary" @click="goEditor()">发表新闻</el-button></div>
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
      label="操作">
      <template slot-scope="scope">
        <el-button type="text" size="small">编辑</el-button>
        <el-button type="text" size="small">删除</el-button>
      </template>
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
  },
  filters:{
  },
  methods: {
    goEditor(_id){
        this.$router.push({
            path:'/cardadmin/center/newseditor',
            query: {_id:_id}
        });
    },
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

