<template>
<div class="wmcard_admincenter_common_right_body">
  <el-form :inline="true" :model="searchForm" class="demo-form-inline">
    <el-form-item label="类型">
      <el-select v-model="searchForm.type" placeholder="搜索类型">
        <el-option label="邮箱" value="email"></el-option>
        <el-option label="md5" value="md5"></el-option>
        <el-option label="昵称" value="nickName"></el-option>
        <el-option label="IP" value="ip"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="内容">
      <el-input v-model="searchForm.text" placeholder="请输入搜索内容"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="search">查询</el-button>
      <el-button @click="clearSearch">取消</el-button>
    </el-form-item>
  </el-form>
  <el-table
    :data="tableData"
    @sort-change="sortChange"
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
      sortable="custom"
      prop="star"
      label="星星">
    </el-table-column>
    <el-table-column
      sortable="custom"
      prop="score"
      label="竞技点">
    </el-table-column>
    <el-table-column
      sortable="custom"
      prop="level"
      label="等级">
    </el-table-column>
    <el-table-column
      prop="exp"
      label="经验">
    </el-table-column>
    <el-table-column
      sortable="custom"
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
      searchForm:{
        type:'email',
        text:''
      },
      searchParams:{},
      searchSort:{
        _id:-1
      }
    }
  },
  mounted() {
    this.getuserInfo();
  },
  methods: {
    sortChange(column){
      console.log(column)
      if(column.order === 'descending'){
        this.searchSort = {};
        this.searchSort[column.prop] = -1;
        this.getuserInfo();
      }else if(column.order === 'ascending'){
        this.searchSort = {};
        this.searchSort[column.prop] = 1;
        this.getuserInfo();
      }else {
        this.searchSort = {};
        this.searchSort['_id'] = -1;
        this.getuserInfo();
      }
    },
    clearSearch(){
      this.page = 1;
      this.getuserInfo();
    },
    search(){
      if(this.searchForm.text==''){
        this.$message.error('请输入搜索内容！');
      }
      this.page = 1;
      let fift = this.searchForm;
      this.getuserInfo(fift);
    },
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
    getuserInfo(fift){
      let params = {
        token:this.token,
        page:this.page,
        sort:this.searchSort
      }
      if(fift){
        params = Object.assign(params, fift);
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

