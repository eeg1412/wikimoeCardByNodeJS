<template>
  <div class="wmcard_admincenter_common_right_body">
    <div class="clearfix"
         v-if="sortMode"
         key="sortOn">
      <el-button class="fr"
                 @click="sortMode = false">返回</el-button>
      <!-- <el-button class="fr mr10"
                 type="primary">提交</el-button> -->
      <el-select v-model="sortType"
                 class="fr mr10"
                 @change="packageSortSet"
                 placeholder="请选择">
        <el-option v-for="item in sortOptions"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="clearfix"
         v-else
         key="sortFalse">
      <el-button class="fr"
                 type="primary"
                 @click="newPackage">创建卡包</el-button>
      <el-button class="fr mr10"
                 type="primary"
                 @click="openSortMode()">更改排序</el-button>
    </div>
    <div class="mt15"
         v-if="sortMode">
      <draggable ghost-class="wmcard_admincenter_package_sort_ghost"
                 v-model="sortData">
        <div v-for="item in sortData"
             :key="item._id"
             class="wmcard_admincenter_package_sort_item">
          <i class="el-icon-rank mr15 cRed"></i>
          <div class="dib mr15">卡包名：{{item.name}}</div>
          <div class="dib"
               v-if="sortType!=='default'">是否开启：<el-switch :value="item[sortType]"
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       disabled>
            </el-switch>
          </div>
        </div>
      </draggable>
      <el-button class="fr mt15"
                 type="primary"
                 @click="sendSort()">提交</el-button>
    </div>
    <el-table :data="tableData"
              style="width: 100%"
              v-else>
      <el-table-column prop="name"
                       label="卡包名">
      </el-table-column>
      <el-table-column prop="packageId"
                       label="卡包ID">
      </el-table-column>
      <el-table-column prop="oneStar"
                       label="一星卡">
      </el-table-column>
      <el-table-column prop="twoStar"
                       label="二星卡">
      </el-table-column>
      <el-table-column prop="threeStar"
                       label="三星卡">
      </el-table-column>
      <el-table-column prop="fourStar"
                       label="四星卡">
      </el-table-column>
      <el-table-column prop="fiveStar"
                       label="五星卡">
      </el-table-column>
      <el-table-column prop="sixStar"
                       label="六星卡">
      </el-table-column>
      <el-table-column label="合计">
        <template slot-scope="scope">
          <div>{{scope.row.oneStar+scope.row.twoStar+scope.row.threeStar+scope.row.fourStar+scope.row.fiveStar+scope.row.sixStar}}</div>
        </template>
      </el-table-column>
      <el-table-column label="日常">
        <template slot-scope="scope">
          <div>
            <el-switch :value="scope.row.open"
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       @change="openPackage(scope.row.open,scope.row._id,'daily')">
            </el-switch>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="星星商店">
        <template slot-scope="scope">
          <div>
            <el-switch :value="scope.row.starShopOpen"
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       @change="openPackage(scope.row.starShopOpen,scope.row._id,'shop')">
            </el-switch>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="猜卡">
        <template slot-scope="scope">
          <div>
            <el-switch :value="scope.row.guessOpen"
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       @change="openPackage(scope.row.guessOpen,scope.row._id,'guess')">
            </el-switch>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="结缘">
        <template slot-scope="scope">
          <div>
            <el-switch :value="scope.row.starCoinOpen"
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       @change="openPackage(scope.row.starCoinOpen,scope.row._id,'starCoin')">
            </el-switch>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="制卡">
        <template slot-scope="scope">
          <div>
            <el-switch :value="scope.row.submitOpen"
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       @change="openPackage(scope.row.submitOpen,scope.row._id,'submitOpen')">
            </el-switch>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click="goEditor(scope.row._id,scope.row.name)">改名</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="提示"
               :visible.sync="dialogVisible"
               width="30%">
      <div>
        <el-input v-model="name"
                  placeholder="请输入卡包名"></el-input>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="sendCardPackage">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { packageSort } from "../../../../utils/utils";
import { authApi } from "../../../api";
import draggable from 'vuedraggable';
import _ from 'lodash';
export default {
  data () {
    return {
      sortInfo: [],
      sortData: [],
      sortOptions: [
        {
          label: "普通排序",
          value: "default"
        },
        {
          label: "日常抽卡排序",
          value: "open"
        },
        {
          label: "星星商店排序",
          value: "starShopOpen"
        },
        // {
        //   label: "猜卡排序",
        //   value: "guessOpen"
        // },
        {
          label: "结缘排序",
          value: "starCoinOpen"
        },
        {
          label: "制卡排序",
          value: "submitOpen"
        }
      ],
      sortType: "default",
      sortMode: false,
      name: '',
      dialogVisible: false,
      id: '',
      type: '',
      tableData: [],
      token: sessionStorage.getItem("adminToken") ? sessionStorage.getItem("adminToken") : localStorage.getItem("adminToken"),
    }
  },
  components: {
    draggable,
  },
  mounted () {
    this.getCardPackage();
  },
  filters: {

  },
  methods: {
    sendSort () {
      let idList = [];
      this.sortData.forEach((item) => {
        idList.push(item._id);
      });
      let paramas = {
        token: this.token,
        sortType: this.sortType,
        sortList: idList,
        type: 'sort'
      };
      authApi.renamecardpackage(paramas).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.$message({
            message: res.data.msg,
            type: 'success'
          });
          this.getCardPackage();
        }
      });
    },
    openSortMode () {
      this.packageSortSet();
      this.sortMode = true;
    },
    packageSortSet () {
      this.sortData = _.cloneDeep(this.tableData);
      this.sortData = packageSort(this.sortData, this.sortInfo, this.sortType);
    },
    openPackage (open, id, type) {
      let paramas = {
        token: this.token,
        open: !open,
        type: type,
        _id: id
      }
      authApi.renamecardpackage(paramas).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.$message({
            message: res.data.msg,
            type: 'success'
          });
          this.getCardPackage();
          this.dialogVisible = false;
        }
      });
    },
    sendCardPackage () {
      let paramas = {
        name: this.name,
        token: this.token,
        type: this.type,
        _id: this.id
      }
      authApi.renamecardpackage(paramas).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.$message({
            message: res.data.msg,
            type: 'success'
          });
          this.getCardPackage();
          this.dialogVisible = false;
        }
      });
    },
    newPackage () {
      this.id = '';
      this.type = 'add';
      this.name = '';
      this.dialogVisible = true;
    },
    goEditor (id, name) {
      this.id = id;
      this.type = 'edit';
      this.name = name;
      this.dialogVisible = true;
    },
    getCardPackage () {
      authApi.searchcardpackage({ all: true }).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.tableData = res.data.data;
          this.sortInfo = res.data.sortData || [];
        }
      });
    },
  },
}
</script>

<style scoped>
.wmcard_admincenter_package_sort_item {
  padding: 10px;
  border-top: 1px solid #ccc;
  cursor: url(/static/cur/move.cur), move;
}
</style>
<style>
.wmcard_admincenter_package_sort_ghost {
  opacity: 0.5;
  background: #ccc;
}
</style>