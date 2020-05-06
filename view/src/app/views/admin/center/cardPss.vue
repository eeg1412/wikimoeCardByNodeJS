<template>
  <div class="wmcard_admincenter_common_right_body">
    <el-table :data="tableData"
              style="width: 100%">
      <el-table-column prop="userID.email"
                       label="邮箱">
      </el-table-column>
      <el-table-column prop="nickName"
                       label="昵称">
      </el-table-column>
      <el-table-column prop="name"
                       label="卡牌名">
      </el-table-column>
      <el-table-column prop="title"
                       label="出处">
      </el-table-column>
      <el-table-column prop="star"
                       label="星级">
      </el-table-column>
      <el-table-column label="被动属性">
        <template slot-scope="scope">
          {{scope.row.leftType | leftType}}
        </template>
      </el-table-column>
      <el-table-column label="主动技能">
        <template slot-scope="scope">
          {{scope.row.rightType | rightType}}
        </template>
      </el-table-column>
      <el-table-column label="水晶">
        <template slot-scope="scope">
          {{scope.row.cry | cry}}
        </template>
      </el-table-column>
      <el-table-column label="通过">
        <template slot-scope="scope">
          <div>{{scope.row.pass?"已通过":"未通过"}}</div>
        </template>
      </el-table-column>
      <el-table-column label="卡包"
                       width="150">
        <template slot-scope="scope">
          <el-select v-model="scope.row.packageId"
                     placeholder="选择卡包"
                     class="wm_card_package_sel"
                     :disabled="scope.row.check?true:false">
            <el-option v-for="item in packageData"
                       :key="item._id"
                       :label="item.name"
                       :value="item._id">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="审核">
        <template slot-scope="scope">
          <div>{{scope.row.check?"已审核":"未审核"}}</div>
        </template>
      </el-table-column>
      <el-table-column width="140"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click="checkUCC(true,scope.row._id,scope.row.packageId)"
                     v-if="scope.row.check === false">通过</el-button>
          <el-button type="text"
                     size="small"
                     @click="checkUCC(false,scope.row._id,scope.row.packageId)"
                     v-if="scope.row.check === false">驳回</el-button>
          <el-tooltip placement="left"
                      v-if="scope.row.check === false">
            <div slot="content"><img :src="'/userCreatCard/'+scope.row._id+'.jpg'"
                   class="wm_admin_cardpass_watchcard" /></div>
            <el-button type="text"
                       size="small"
                       @click="watchCard('/userCreatCard/'+scope.row._id+'.jpg')">卡面</el-button>
          </el-tooltip>
          <el-tooltip placement="left"
                      v-if="scope.row.check&&scope.row.pass">
            <div slot="content"><img :src="$wikimoecard.url+scope.row.cardID+'.jpg'"
                   class="wm_admin_cardpass_watchcard" /></div>
            <el-button type="text"
                       size="small"
                       @click="watchCard($wikimoecard.url+scope.row.cardID+'.jpg')">卡面</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
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
export default {
  data () {
    return {
      packageData: [],
      cardTotle: 0,
      page: 1,
      tableData: [],
      token: sessionStorage.getItem("adminToken") ? sessionStorage.getItem("adminToken") : localStorage.getItem("adminToken"),
    }
  },
  mounted () {
    this.getUCC();
    this.getCardPackage();
  },
  filters: {
    leftType (v) {
      let name = '';
      switch (v) {
        case 1:
          name = '全能';
          break;
        case 2:
          name = '兵攻';
          break;
        case 3:
          name = '盾防';
          break;
        case 4:
          name = '速度';
          break;
        case 5:
          name = '爱心';
          break;
      }
      return name;
    },
    cry (v) {
      let name = '';
      switch (v) {
        case 1:
          name = '红';
          break;
        case 2:
          name = '蓝';
          break;
        case 3:
          name = '绿';
          break;
        case 4:
          name = '光';
          break;
        case 5:
          name = '暗';
          break;
      }
      return name;
    },
    rightType (v) {
      let name = '';
      switch (v) {
        case 1:
          name = '物';
          break;
        case 2:
          name = '魔';
          break;
        case 3:
          name = '防';
          break;
        case 4:
          name = '治';
          break;
        case 5:
          name = '妨';
          break;
        case 6:
          name = '支';
          break;
        case 7:
          name = '特';
          break;
      }
      return name;
    }
  },
  methods: {
    cardPageChange () {
      this.getUCC();
    },
    watchCard (imgsrc) {
      this.$alert('<div class="watch_img"><img src="' + imgsrc + '" /></div>', '查看卡牌', {
        dangerouslyUseHTMLString: true,
        lockScroll: false,
        customClass: 'wm_crearchcard_watch',
      });
    },
    getCardPackage () {
      authApi.searchcardpackage({ all: true }).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.packageData = res.data.data;
        }
      });
    },
    checkUCC (pass, id, packageId) {
      if (!packageId && packageId != 0 && pass) {
        this.$message.error('请设置卡包');
        return false;
      }
      if (pass) {
        this.$confirm('确定通过吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          authApi.adminCreatcard({ token: this.token, type: 'check', packageId: packageId, id: id, pass: pass }).then(res => {
            console.log(res);
            if (res.data.code == 0) {
              this.$message.error(res.data.msg);
            } else if (res.data.code == 1) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
              this.getUCC();
            }
          })
        }).catch(() => {

        });
      } else {
        this.$prompt('请输入驳回理由', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          lockScroll: false,
        }).then(({ value }) => {
          authApi.adminCreatcard({ token: this.token, type: 'check', packageId: packageId, id: id, pass: pass, mark: value }).then(res => {
            console.log(res);
            if (res.data.code == 0) {
              this.$message.error(res.data.msg);
            } else if (res.data.code == 1) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
              this.getUCC();
            }
          })
        }).catch(() => {
        });
      }
    },
    getUCC () {
      authApi.adminCreatcard({ token: this.token, type: 'get', page: this.page }).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.tableData = res.data.data;
          this.cardTotle = res.data.total;
        }
      })
    }
  },
}
</script>
<style>
.wm_admin_cardpass_watchcard {
  width: 396px;
  height: 556px;
}
</style>
