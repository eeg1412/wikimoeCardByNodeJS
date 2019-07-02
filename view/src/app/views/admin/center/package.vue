<template>
<div class="wmcard_admincenter_common_right_body">
  <div class="clearfix"><el-button class="fr" type="primary">创建卡包</el-button></div>
  <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column
      label="时间">
      <template slot-scope="scope">
        <span>{{scope.row.time | capitalize}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="title"
      label="标题">
    </el-table-column>
    <el-table-column
      prop="text"
      label="内容">
      <template slot-scope="scope">
        <div class="wmcard_admincenter_news_text" :title="scope.row.text">{{scope.row.text}}</div>
      </template>
    </el-table-column>
    <el-table-column
      label="首页显示">
      <template slot-scope="scope">
        <span>{{scope.row.top | topfif}}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <el-button type="text" size="small" @click="goEditor(scope.row._id)">编辑</el-button>
        <el-button type="text" size="small" @click="del(scope.row._id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
import {authApi} from "../../../api";
export default {
  data() {
    return {
      tableData: [],
      token:sessionStorage.getItem("adminToken")?sessionStorage.getItem("adminToken"):localStorage.getItem("adminToken"),
    }
  },
  mounted() {
  },
  filters:{

  },
  methods: {

  },
}
</script>

