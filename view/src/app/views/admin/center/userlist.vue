<template>
  <div class="wmcard_admincenter_common_right_body">
    <el-form :inline="true"
             :model="searchForm"
             class="demo-form-inline">
      <el-form-item label="类型">
        <el-select v-model="searchForm.type"
                   placeholder="搜索类型">
          <el-option label="邮箱"
                     value="email"></el-option>
          <el-option label="md5"
                     value="md5"></el-option>
          <el-option label="昵称"
                     value="nickName"></el-option>
          <el-option label="IP"
                     value="ip"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="searchForm.text"
                  placeholder="请输入搜索内容"></el-input>
      </el-form-item>
      <el-form-item label="是否封号">
        <el-select v-model="searchForm.ban"
                   placeholder="是否封号">
          <el-option label="全部"
                     value="all"></el-option>
          <el-option label="未封号"
                     value="0"></el-option>
          <el-option label="封号"
                     value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="search">查询</el-button>
        <el-button @click="clearSearch">取消</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData"
              @sort-change="sortChange"
              style="width: 100%">
      <el-table-column prop="email"
                       label="邮箱">
      </el-table-column>
      <el-table-column prop="nickName"
                       label="昵称">
      </el-table-column>
      <el-table-column sortable="custom"
                       prop="star"
                       label="星星">
      </el-table-column>
      <el-table-column sortable="custom"
                       prop="score"
                       label="竞技点">
      </el-table-column>
      <el-table-column sortable="custom"
                       prop="level"
                       label="等级">
      </el-table-column>
      <el-table-column prop="exp"
                       label="经验">
        <template slot-scope="scope">
          <span>{{scope.row.exp}}/{{cardData.level[scope.row.level>5?5:scope.row.level]}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable="custom"
                       prop="deminingStarCount"
                       label="累计挖矿">
      </el-table-column>
      <el-table-column sortable="custom"
                       prop="cardIndexCount"
                       label="卡种量">
        <template slot-scope="scope">
          <span>{{scope.row.cardIndexCount}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable="custom"
                       prop="robotRate"
                       label="可疑度">
        <template slot-scope="scope">
          <span>{{scope.row.robotRate}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable="custom"
                       prop="setRobotRate"
                       label="手动可疑度">
        <template slot-scope="scope">
          <span>{{scope.row.setRobotRate}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px"
                       label="注册时间">
        <template slot-scope="scope">
          <span>{{scope.row._id | capitalize}}</span>
        </template>
      </el-table-column>
      <el-table-column width="140px"
                       prop="ip"
                       label="IP">
      </el-table-column>
      <el-table-column width="180px"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="text"
                     @keydown.enter.native.prevent
                     size="small"
                     @click="setRobotRate(scope.row._id)">增加可疑度</el-button>
          <el-button type="text"
                     @keydown.enter.native.prevent
                     size="small"
                     @click="banEmail(scope.row.ban,scope.row._id)">{{scope.row.ban?'解封':'封号'}}</el-button>
          <el-button type="text"
                     @keydown.enter.native.prevent
                     size="small"
                     @click="watchCard(scope.row.md5)">卡牌</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="cGray999 f12 pl10 pt10">结果总计：{{cardTotle}}</div>
    <el-pagination small
                   layout="prev, pager, next"
                   :total="cardTotle"
                   @current-change="cardPageChange"
                   :current-page.sync="page"
                   :page-size="20"
                   class="wmcard_user_page">
    </el-pagination>
  </div>
</template>

<script>
import { authApi } from "../../../api";
import { mailCheck } from "../../../../utils/utils";
import cardData from "../../../../utils/cardData"
export default {
  data () {
    return {
      cardData: cardData,
      tableData: [],
      token: sessionStorage.getItem("adminToken") ? sessionStorage.getItem("adminToken") : localStorage.getItem("adminToken"),
      page: 1,
      cardTotle: 0,
      searchForm: {
        type: 'email',
        text: '',
        ban: 'all'
      },
      searchParams: {},
      searchSort: {
        _id: -1
      }
    }
  },
  mounted () {
    this.getuserInfo();
  },
  filters: {
    capitalize (value) {
      var date = new Date(parseInt(value.substring(0, 8), 16) * 1000);
      var tt = [date.getFullYear(), ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1), (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())].join('-') + '  ' + [(date.getHours() < 10 ? '0' + date.getHours() : date.getHours()), (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()), (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())].join(':');
      return tt;
    }
  },
  methods: {
    sortChange (column) {
      console.log(column)
      if (column.order === 'descending') {
        this.searchSort = {};
        this.searchSort[column.prop] = -1;
        this.getuserInfo();
      } else if (column.order === 'ascending') {
        this.searchSort = {};
        this.searchSort[column.prop] = 1;
        this.getuserInfo();
      } else {
        this.searchSort = {};
        this.searchSort['_id'] = -1;
        this.getuserInfo();
      }
    },
    clearSearch () {
      this.page = 1;
      this.getuserInfo();
    },
    search () {
      this.page = 1;
      let fift = this.searchForm;
      this.getuserInfo(fift);
    },
    cardPageChange (p) {
      this.page = p;
      this.getuserInfo();
    },
    watchCard (md5) {
      console.log(md5);
      let routeData = this.$router.resolve({
        name: "home",
        query: { md5: md5 }
      });
      window.open(routeData.href, '_blank');
    },
    getuserInfo (fift) {
      let params = {
        token: this.token,
        page: this.page,
        sort: this.searchSort
      }
      if (fift) {
        params = Object.assign(params, fift);
      }
      authApi.adminsearchuser(params).then(res => {
        console.log(res);
        if (res.data.code == 1) {
          this.tableData = res.data.data.data;
          this.cardTotle = res.data.data.total;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    setRobotRate (id) {
      this.$prompt('请设置可疑度', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        lockScroll: false,
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            const value = instance.inputValue;
            if (value === null || value === "") {
              this.$message.error("请设置可疑度！");
              return false;
            }
            let params = {
              token: this.token,
              id: id,
              rate: value
            }
            authApi.adminSetRobotRate(params).then(res => {
              console.log(res);
              if (res.data.code == 1) {
                this.$message({
                  message: res.data.msg,
                  type: 'success'
                });
                this.getuserInfo(this.searchForm);
                done();
              } else {
                this.$message.error(res.data.msg);
              }
            });
          } else {
            done();
          }
        }
      }).then(({ value }) => {
      }).catch(() => {
      });
    },
    banEmail (ban, id) {
      let params = {
        token: this.token,
        id: id,
      }
      if (!ban) {
        params['type'] = 'ban';
      }
      authApi.adminban(params).then(res => {
        console.log(res);
        if (res.data.code == 1) {
          this.$message({
            message: res.data.msg,
            type: 'success'
          });
          this.getuserInfo(this.searchForm);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
  },
}
</script>

