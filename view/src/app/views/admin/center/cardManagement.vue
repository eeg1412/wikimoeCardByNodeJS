<template>
  <div class="wmcard_admincenter_common_right_body">
    <div class="wm_handbook_cardlist wm_admin_giveitem_body">
      <div class="wm_cardlist_select_search_body">
        <el-form :inline="true"
                 :model="searchForm">
          <el-form-item label="选择卡包">
            <el-select v-model="seledCardPackage"
                       placeholder="选择卡包"
                       class="wm_cardlist_select type_120">
              <el-option v-for="item in cardPackage"
                         :key="item.packageId"
                         :label="item.name"
                         :value="item.packageId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出自作品">
            <el-input v-model="searchForm.title"
                      placeholder="请输入作品名"
                      class="wm_cardlist_search_input"
                      clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="角色名字">
            <el-input v-model="searchForm.name"
                      placeholder="请输入角色名"
                      class="wm_cardlist_search_input"
                      clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="星星等级">
            <el-select class="wm_cardlist_select"
                       v-model="searchForm.star"
                       placeholder="筛选星级">
              <el-option label="全部"
                         value="0"></el-option>
              <el-option label="1星"
                         value="1"></el-option>
              <el-option label="2星"
                         value="2"></el-option>
              <el-option label="3星"
                         value="3"></el-option>
              <el-option label="4星"
                         value="4"></el-option>
              <el-option label="5星"
                         value="5"></el-option>
              <el-option label="6星"
                         value="6"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="水晶属性">
            <el-select class="wm_cardlist_select"
                       v-model="searchForm.cry"
                       placeholder="筛选水晶属性">
              <el-option label="全部"
                         value="0"></el-option>
              <el-option label="红火"
                         value="1"></el-option>
              <el-option label="蓝水"
                         value="2"></el-option>
              <el-option label="绿风"
                         value="3"></el-option>
              <el-option label="光"
                         value="4"></el-option>
              <el-option label="暗"
                         value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="被动属性">
            <el-select class="wm_cardlist_select"
                       v-model="searchForm.leftType"
                       placeholder="筛选被动属性">
              <el-option label="全部"
                         value="0"></el-option>
              <el-option label="全能"
                         value="1"></el-option>
              <el-option label="兵攻"
                         value="2"></el-option>
              <el-option label="盾防"
                         value="3"></el-option>
              <el-option label="速度"
                         value="4"></el-option>
              <el-option label="爱心"
                         value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主动技能">
            <el-select class="wm_cardlist_select"
                       v-model="searchForm.rightType"
                       placeholder="筛选主动技能">
              <el-option label="全部"
                         value="0"></el-option>
              <el-option label="物"
                         value="1"></el-option>
              <el-option label="魔"
                         value="2"></el-option>
              <el-option label="防"
                         value="3"></el-option>
              <el-option label="治"
                         value="4"></el-option>
              <el-option label="妨"
                         value="5"></el-option>
              <el-option label="支"
                         value="6"></el-option>
              <el-option label="特"
                         value="7"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       @click="searchChanged">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="cardBook.length>0"
           ref="cardList">
        <el-table :data="cardBook"
                  border
                  current-row-key="_id"
                  style="width: 100%">
          <el-table-column prop="cardId"
                           label="卡面"
                           width="120px"
                           header-align="center">
            <template slot-scope="scope">
              <el-tooltip placement="right">
                <div slot="content"><img :src="$wikimoecard.url+scope.row.packageId+'/'+scope.row.cardId+'.jpg?time='+timeStamp"
                       class="wm_admin_cardmanage_watchcard" /></div>
                <div class="tc">
                  <img :src="$wikimoecard.url+scope.row.packageId+'/'+scope.row.cardId+'.jpg?time='+timeStamp"
                       width="80px"
                       :key="scope.row.cardId">
                </div>

              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="cardId"
                           label="卡牌ID"
                           width="80px">
          </el-table-column>
          <el-table-column prop="name"
                           label="卡牌名">
          </el-table-column>
          <el-table-column prop="title"
                           label="出处">
          </el-table-column>
          <el-table-column prop="packageId"
                           label="卡包"
                           width="130px">
            <template slot-scope="scope">
              {{cardPackage.filter(item=>item.packageId===scope.row.packageId).length>0?cardPackage.filter(item=>item.packageId===scope.row.packageId)[0].name:'--'}}
            </template>
          </el-table-column>
          <el-table-column prop="star"
                           label="星级"
                           width="60px">
          </el-table-column>
          <el-table-column label="被动属性"
                           width="80px">
            <template slot-scope="scope">
              {{scope.row.leftType | leftType}}
            </template>
          </el-table-column>
          <el-table-column label="主动技能"
                           width="80px">
            <template slot-scope="scope">
              {{scope.row.rightType | rightType}}
            </template>
          </el-table-column>
          <el-table-column label="水晶"
                           width="60px">
            <template slot-scope="scope">
              {{scope.row.cry | cry}}
            </template>
          </el-table-column>
          <el-table-column prop="auther"
                           label="作者"
                           width="100px"
                           header-align="center">
            <template slot-scope="scope">
              <div class="tc"><img :src="'/api/gravatar.png?md5='+scope.row.md5"
                     width="50px"
                     height="50px" />
                <div class="mt5">{{scope.row.auther}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           width="100px"
                           header-align="center">
            <template slot-scope="scope">
              <div class="tc">
                <el-button type="text"
                           size="small"
                           @click="openEditor(scope.row)">编辑</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <div class="wm_mycard_list" v-if="cardBook.length>0" ref="cardList">
            <div class="wm_market_mycard_item type_mobile type_admin_sel_card" v-for="(item,index) in cardBook" v-bind:key="index">
                <img class="wm_getcard_img" :src="$wikimoecard.url+item.packageId+'/'+item.cardId+'.jpg'" :key='item.cardId'>
            </div>
        </div> -->
      <div class="common_nocard_tips"
           v-show="cardBook.length<=0&&!loading">该条件下暂无卡牌！</div>
      <div class="wm_market_content_page"
           v-if="cardBook.length>0">
        <el-pagination small
                       layout="prev, pager, next"
                       :total="cardTotle"
                       @current-change="cardPageChange"
                       :current-page.sync="cardPage"
                       :page-size="50"
                       class="my_card_page">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="编辑"
               top="10px"
               :visible.sync="dialogVisible"
               width="90%"
               :close-on-click-modal="false"
               :destroy-on-close="true"
               :before-close="handleClose">
      <div>
        <adminCardEditor :editorData="editorData"
                         @cardUpdated="getCardData()"
                         ref="adminCardEditor"></adminCardEditor>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="editCard()">修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { authApi } from "../../../api";
import { mailCheck, packageSort } from "../../../../utils/utils";
import adminCardEditor from '../../../components/adminCardEditor.vue';
export default {
  data () {
    return {
      timeStamp: new Date().getTime(),
      dialogVisible: false,
      txDays: new Date().getDate(),
      loading: false,
      token: sessionStorage.getItem("adminToken") ? sessionStorage.getItem("adminToken") : localStorage.getItem("adminToken"),
      cardBook: [],
      cardCount: {},
      cardPage: Number(this.$route.query.page) || 1,
      cardTotle: 0,
      searchForm: {
        star: this.$route.query.star || '0',
        cry: this.$route.query.cry || '0',
        rightType: this.$route.query.rightType || '0',
        leftType: this.$route.query.leftType || '0',
        title: decodeURIComponent(this.$route.query.title || ''),
        name: decodeURIComponent(this.$route.query.name || ''),
      },
      selCardData: null,
      seledCardPackage: '-1',
      cardPackage: [],
      editorData: {},
    }
  },
  components: {
    adminCardEditor
  },
  created () {
    this.getCardPackage();
    this.getCardData();
  },
  mounted () {
  },
  filters: {
    packageIDFilters (v) {
      let name = '';
      debugger
      console.log(this.cardPackage);
      const packInfo = this.cardPackage.filter(item => item.packageId === v);
      if (packInfo.length > 0) {
        name = packInfo[0].name;
      }
      return name;
    },
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
    editCard () {
      this.$refs.adminCardEditor.creatCardNoText();
    },
    handleClose (done) {
      this.$confirm('确定关闭卡牌编辑吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        done();
      }).catch(() => {

      });
    },
    openEditor (data) {
      this.editorData = data;
      this.dialogVisible = true;
    },
    getCardData () {
      const params = this.searchForm;
      params['token'] = this.token;
      params['page'] = this.cardPage;
      params['packageId'] = this.seledCardPackage;
      authApi.adminSearchcard(params).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.timeStamp = new Date().getTime();
          this.cardBook = res.data.data;
          this.cardTotle = res.data.totle;
        }
      });
    },
    getCardPackage () {
      authApi.searchcardpackage({ sortType: "default" }).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.cardPackage = res.data.data;
          // 给卡包排序
          this.cardPackage = packageSort(this.cardPackage, res.data.sortData, "default");
          this.cardPackage.unshift({ packageId: '-1', name: '全部卡包' });
        }
      });
    },
    searchChanged () {
      this.cardPage = 1;
      this.cardPageChange(1);
    },
    cardPageChange (val) {
      this.cardPage = val;
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      this.getCardData();
      this.$router.replace({
        name: 'cardmanagement',
        query: {
          page: this.cardPage,
          star: this.searchForm.star,
          cry: this.searchForm.cry,
          rightType: this.searchForm.rightType,
          leftType: this.searchForm.leftType,
          title: encodeURIComponent(this.searchForm.title),
          name: encodeURIComponent(this.searchForm.name),
          packageId: this.seledCardPackage
        }
      });
    },
  },
}
</script>

<style scoped>
.wm_handbook_cardlist
  .wm_mycard_list
  .wm_market_mycard_item.type_admin_sel_card {
  opacity: 1;
}
.wm_admin_giveitem_body *::-webkit-scrollbar-track-piece {
  background: #eee;
}

.wm_admin_giveitem_body *::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.wm_admin_giveitem_body *::-webkit-scrollbar-thumb {
  height: 40px;
  border-radius: 4px;
  background-color: #a5a5a5;
}

.wm_admin_giveitem_body *::-webkit-scrollbar-thumb:hover {
  background-color: #bbb;
}
.wm_admin_w250 {
  width: 250px;
}
.wm_admin_cardmanage_watchcard {
  width: 396px;
  height: 556px;
}
</style>
