<template>
  <div>
    <el-dialog :title="title"
               :destroy-on-close="true"
               :visible.sync="cardDialog"
               :lock-scroll="false"
               :append-to-body="true"
               :modal-append-to-body="true"
               class="wm_handbook_info_dialog wm_cardinfo_dialog"
               top="50px"
               width="852px">
      <div>
        <div class="tc mb15"
             v-if="tip!==''">{{tip}}</div>
        <div>
          <el-table :data="cardListTable"
                    max-height="319"
                    stripe
                    border>
            <el-table-column label=""
                             width="40">
              <template slot-scope="scope">
                <div class="tc">
                  <el-button type="text"
                             icon="el-icon-delete"
                             @click="del(scope.row[materId])"></el-button>
                </div>

              </template>
            </el-table-column>
            <el-table-column label="立绘"
                             width="50">
              <template slot-scope="scope">
                <el-tooltip placement="right"
                            :enterable="false">
                  <div slot="content"><img :src="$wikimoecard.url+scope.row.packageId+'/'+scope.row.cardId+'.jpg'"
                         class="wm_co_market_card_list"></div>
                  <div class="tc"><img :src="$wikimoecard.url+scope.row.packageId+'/'+scope.row.cardId+'.jpg'"
                         width="20px"
                         height="auto">
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="设置星星"
                             width="150"
                             v-if="setStar">
              <template slot-scope="scope">
                <el-input-number class="wm_market_card_datail_price_input_box"
                                 size="mini"
                                 v-model="scope.row.price"
                                 :precision="0"
                                 :step="1"
                                 :max="99999999"
                                 :min="minPriceCal(scope.row.star)"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="角色"
                             prop="name"></el-table-column>
            <el-table-column label="作品"
                             prop="title"></el-table-column>
            <el-table-column label="星级"
                             prop="star"></el-table-column>
            <el-table-column label="卡包">
              <template slot-scope="scope">
                {{getPackageName(scope.row.packageId)}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <div class="dib">
          <el-input placeholder="请输入计算结果"
                    v-model="captcha"
                    type="tel">
            <template slot="prepend"><img class="reg_code_img"
                   :src="captchaSrc"
                   @click="captchaUpdata"></template>
            <template slot="append">
              <el-button @click="send">提交</el-button>
            </template>
          </el-input>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { authApi } from "../api"

export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    tip: {
      type: String,
      default: ""
    },
    cardList: {
      type: Array,
      default: []
    },
    setStar: {
      type: Boolean,
      default: false
    },
    cardPackage: {
      type: Array,
      default: []
    },
    materId: {
      type: String,
      default: "cardId"
    },
  },
  data () {
    return {
      cardListTable: [],
      cardDialog: false,
      captcha: "",
      captchaSrc: '/api/captcha?time=' + new Date().getTime(),
    }
  },
  mounted () {

  },
  components: {

  },
  methods: {
    send () {
      this.$emit('send', this.captcha);
    },
    del (id) {
      this.$emit('del', id);
      this.reloadData();
    },
    reloadData () {
      this.cardListTable = [];
      console.log(this.cardList);
      this.cardList.forEach((item, i) => {
        this.$set(this.cardListTable, i, item);
      });
    },
    closeDialog () {
      this.cardDialog = false;
      this.cardListTable = [];
    },
    openDialog () {
      this.captcha = "";
      this.cardListTable = this.cardList;
      this.cardDialog = true;
      this.captchaUpdata();
    },
    captchaUpdata () {
      this.captchaSrc = '/api/captcha?time=' + new Date().getTime();
    },
    minPriceCal (s) {
      // 计算最低售价
      if (s == 6) {
        return 600;
      } else if (s == 5) {
        return 200;
      } else if (s == 4) {
        return 90;
      } else {
        return 30;
      }
    },
    getPackageName (packageId) {
      const packageInfo = _.find(this.cardPackage, { 'packageId': packageId });
      if (packageInfo) {
        return packageInfo.name;
      } else {
        return "";
      }
    },
  }
}
</script>

<style scoped>
.wm_co_market_card_list {
  max-width: 20vw;
  height: auto;
}
</style>