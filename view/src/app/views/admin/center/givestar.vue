<template>
  <div class="wmcard_admincenter_common_right_body">
    <el-form :model="giveStar"
             label-width="140px">
      <el-form-item label="全员">
        <el-switch v-model="giveStar.sendAll"></el-switch>
      </el-form-item>
      <el-form-item label="类型">
        <el-radio-group v-model="giveStar.type">
          <el-radio label="star">星星</el-radio>
          <el-radio label="card">卡牌</el-radio>
          <el-radio label="item">道具</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="giveStar.title"
                  placeholder="请填写标题"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <el-input type="textarea"
                  :rows="4"
                  placeholder="请填写内容"
                  v-model="giveStar.text">
        </el-input>
      </el-form-item>
      <el-form-item label="卡牌"
                    v-if="giveStar.type==='card'">
        <div class="wm_admin_w250"
             :class="{'tc':selCardData}">
          <img :src="$wikimoecard.url+selCardData.packageId+'/'+selCardData.cardId+'.jpg'"
               class="wm_set_pointer mb10"
               width="250px"
               height="auto"
               @click="openCardSelDialog"
               v-if="selCardData" />
          <el-button type="primary"
                     @click="openCardSelDialog">选择卡牌</el-button>
        </div>
      </el-form-item>
      <el-form-item label="道具"
                    v-if="giveStar.type==='item'">
        <el-select v-model="giveStar.itemId"
                   placeholder="请选择道具">
          <el-option v-for="item in itemData_"
                     :key="item[0]"
                     :label="item[1].name"
                     :value="item[0]">
            <span><img :src="'/static/otherImg/item/'+item[0]+'.png'"
                   height="24px"
                   width="24px" /> {{ item[1].name }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数量">
        <el-input-number size="medium"
                         v-model="giveStar.itemNumber"
                         :precision="0"
                         :step="1"
                         :min="1"
                         :max="99999999"></el-input-number>
      </el-form-item>
      <el-form-item label="邮箱"
                    v-if="!giveStar.sendAll">
        <el-input v-model="giveStar.email"
                  placeholder="请填写邮箱地址"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="过期时间">
        <el-date-picker v-model="giveStar.endTime"
                        value-format="timestamp"
                        type="datetime"
                        placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="onSubmitPre">赠送</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="选择卡牌"
               :visible.sync="cardSelDialog"
               top="10px"
               width="90%">
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
            <div></div>
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
        <div class="wm_mycard_list"
             v-if="cardBook.length>0"
             ref="cardList">
          <div class="wm_market_mycard_item type_mobile type_admin_sel_card"
               v-for="(item,index) in cardBook"
               v-bind:key="index"
               @click="selCard(item.cardId,item.packageId)">
            <img class="wm_getcard_img"
                 :src="$wikimoecard.url+item.packageId+'/'+item.cardId+'.jpg'"
                 :key='item.cardId'>
          </div>
        </div>
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
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="cardSelDialog = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { authApi } from "../../../api";
import { mailCheck, packageSort } from "../../../../utils/utils";
import itemData from '../../../../../../server/data/item';
export default {
  data () {
    return {
      loading: false,
      cardSelDialog: false,
      giveStar: {
        email: '',
        sendAll: false,
        text: '',
        title: '',
        endTime: Math.round(new Date().getTime()),
        type: 'star',
        itemId: '',
        cardId: '',
        itemNumber: 1,
      },
      itemData_: Object.entries(itemData),
      token: sessionStorage.getItem("adminToken") ? sessionStorage.getItem("adminToken") : localStorage.getItem("adminToken"),
      cardBook: [],
      cardCount: {},
      cardPage: 1,
      cardTotle: 0,
      searchForm: {
        star: '0',
        cry: '0',
        rightType: '0',
        leftType: '0',
        title: '',
        name: '',
      },
      selCardData: null,
      seledCardPackage: '-1',
      cardPackage: [],
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    openCardSelDialog () {
      this.getCardPackage();
      this.getCardData();
      this.cardSelDialog = true;
    },
    onSubmitPre () {
      this.$confirm('确定要赠与吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.onSubmit();
      }).catch(() => {
      });
    },
    onSubmit () {
      let email = this.giveStar.email;
      let sendAll = this.giveStar.sendAll;
      if (!mailCheck(email) && !this.giveStar.sendAll) {
        this.$message.error('邮箱格式有误！');
        return false;
      }
      let params = this.giveStar;
      params['token'] = this.token;
      authApi.admingivestar(params).then(res => {
        console.log(res);
        if (res.data.code == 1) {
          this.$message({
            message: res.data.msg,
            type: 'success'
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
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
      if (this.$refs['cardList']) {
        this.$refs['cardList'].scrollTop = 0;
      }
      this.getCardData();
    },
    selCard (cardId, packageId) {
      this.giveStar.cardId = cardId;
      this.selCardData = {
        packageId: packageId,
        cardId: cardId,
      }
      this.cardSelDialog = false
    }
  },
}
</script>

<style scoped>
.wm_handbook_cardlist
  .wm_mycard_list
  .wm_market_mycard_item.type_admin_sel_card {
  opacity: 1;
}
.wm_mycard_list {
  max-height: calc(100vh - 428px);
  overflow: auto;
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
</style>
