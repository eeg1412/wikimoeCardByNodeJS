<template>
  <div class="wmcard_admincenter_common_right_body">
    <div class="clearfix">
      <el-button class="fr"
                 type="primary"
                 @click="goEditor()">发表公告</el-button>
    </div>
    <el-table :data="tableData"
              style="width: 100%">
      <el-table-column label="时间">
        <template slot-scope="scope">
          <span>{{scope.row.time | capitalize}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="title"
                       label="标题">
      </el-table-column>
      <el-table-column prop="text"
                       label="内容">
        <template slot-scope="scope">
          <div class="wmcard_admincenter_news_text"
               :title="scope.row.text">{{scope.row.text}}</div>
        </template>
      </el-table-column>
      <el-table-column label="首页显示">
        <template slot-scope="scope">
          <span>{{scope.row.top | topfif}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text"
                     @keydown.enter.native.prevent
                     size="small"
                     @click="goEditor(scope.row._id)">编辑</el-button>
          <el-button type="text"
                     @keydown.enter.native.prevent
                     size="small"
                     @click="del(scope.row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination small
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
import { authApi } from "../../../api";
import { mailCheck } from "../../../../utils/utils";
export default {
  data () {
    return {
      tableData: [],
      token: sessionStorage.getItem("adminToken") ? sessionStorage.getItem("adminToken") : localStorage.getItem("adminToken"),
      page: 1,
      totle: 0,
    }
  },
  mounted () {
    this.getNews();
  },
  filters: {
    topfif: function (top) {
      let t = '否';
      if (top) {
        t = '是';
      }
      return t;
    },
    capitalize: function (value) {
      var date = new Date(parseInt(value));
      var tt = [date.getFullYear(), ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1), (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())].join('-') + '  ' + [(date.getHours() < 10 ? '0' + date.getHours() : date.getHours()), (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()), (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())].join(':');
      return tt;
    }
  },
  methods: {
    del (_id) {
      this.$confirm('此操作将永久删除该公告, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          type: 'del',
          _id: _id,
          token: this.token,
        }
        authApi.adminNews(params).then(res => {
          console.log(res);
          if (res.data.code == 1) {
            this.$message({
              message: '公告删除成功！',
              type: 'success'
            });
            this.getNews();
          } else {
            this.$message.error(res.data.msg);
          }
        });
      }).catch(() => {

      });
    },
    goEditor (_id) {
      this.$router.push({
        path: '/cardadmin/center/newseditor',
        query: { _id: _id }
      });
    },
    pageChange (p) {
      this.page = p;
      this.getNews();
    },
    getNews () {
      let params = {
        page: this.page
      }
      authApi.news(params).then(res => {
        console.log(res);
        if (res.data.code == 1) {
          this.tableData = res.data.data;
          this.totle = res.data.total;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
  },
}
</script>

