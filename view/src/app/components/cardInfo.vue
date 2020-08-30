<template>
  <div>
    <el-dialog title="卡牌详情"
               :visible.sync="cardInfoShow"
               :lock-scroll="false"
               :append-to-body="true"
               :modal-append-to-body="true"
               class="wm_handbook_info_dialog wm_cardinfo_dialog"
               top="50px"
               width="852px">
      <el-row :gutter="20"
              v-if="cardData">
        <el-col :sm="12"
                :xs="24"
                class="mb10">
          <div>
            <img class="wm_handbook_info_img"
                 :src="this.$wikimoecard.url+cardData.packageId+'/'+cardData.cardId+'.jpg'"
                 :key="cardData.cardId" />
          </div>
        </el-col>
        <el-col :sm="12"
                :xs="24"
                v-show="buyMode">
          <div>
            <el-table :data="cardList"
                      max-height="319"
                      stripe
                      border>
              <el-table-column label="贩卖价格">
                <template slot-scope="scope">
                  <span><span class="wm_top_info_star">★</span>{{scope.row.price}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作"
                               width="80">
                <template slot-scope="scope">
                  <el-button type="primary"
                             size="mini"
                             @click="buyCard(scope.row)">购买</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div>
            <div class="tc mt10"
                 v-if="cardTotle">
              <el-pagination small
                             layout="prev, pager, next"
                             :total="cardTotle"
                             @current-change="cardPageChange"
                             :current-page.sync="buyPage"
                             :page-size="20">
              </el-pagination>
            </div>
          </div>
          <!-- 求卡 -->
          <div class="mt10 wm_cardinfo_wantcard_body">
            <h6 class="tc f18 mb10">求卡</h6>
            <div class="tc mb15">Tip:求购信息有效期为3天。</div>
            <el-form ref="form"
                     label-width="80px">
              <el-form-item label="期望星星"
                            style="margin-bottom:0px">
                <el-input-number class="wm_market_card_datail_price_input_box"
                                 size="medium"
                                 v-model="wantPrice"
                                 :precision="0"
                                 :step="1"
                                 :max="99999999"
                                 :min="minPriceCal(cardData.star)"></el-input-number>
              </el-form-item>
            </el-form>
            <el-button type="primary"
                       class="w_10 mt10 mb10"
                       @click="wantCard()">求卡</el-button>
          </div>
        </el-col>
        <el-col :sm="12"
                :xs="24"
                v-show="!buyMode">
          <div class="wm_handbook_cardinfo_body type_cardinfo">
            <div class="wm_handbook_cardinfo_item">角色名称：{{cardData.name}}</div>
            <div class="wm_handbook_cardinfo_item">卡牌编号：{{cardData.cardId}}</div>
            <div class="wm_handbook_cardinfo_item">出自作品：《{{cardData.title}}》</div>
            <div class="wm_handbook_cardinfo_item">星星等级：{{cardData.star}}星</div>
            <div class="wm_handbook_cardinfo_item">水晶属性：{{cardData.cry | cry}}</div>
            <div class="wm_handbook_cardinfo_item">被动属性：{{cardData.leftType | leftType}}</div>
            <div class="wm_handbook_cardinfo_item">主动技能：{{cardData.rightType | rightType}}</div>
            <div class="wm_handbook_cardinfo_item">拥有卡牌：{{cardData.have || '0'}}张</div>
            <div class="wm_handbook_cardinfo_item"
                 v-if="cardData.level">卡牌等级：{{cardData.level+1}}级</div>
            <div class="wm_handbook_cardinfo_item">市场贩卖：{{loadingMarket?'获取中...':cardTotle+'张'}}</div>
            <div class="wm_handbook_cardinfo_item"
                 v-if="cardData.auther">卡牌提供：<el-tooltip class="item"
                          effect="dark"
                          placement="top">
                <div slot="content"
                     class="tc"><img class="wm_handbook_auther_tx"
                       :src="'/api/gravatar.png?md5='+cardData.md5" />
                  <div class="mt5">{{cardData.auther}}</div>
                </div><span class="dib">{{cardData.auther}}</span>
              </el-tooltip>
            </div>
          </div>
          <div class="wm_market_card_datail_charts type_cardinfo_dialog mt10">
            <ve-line :data="chartData"
                     :settings="chartSettings"
                     :extend="extend"
                     v-if="chartData.rows.length>0"
                     :colors="colors"
                     height="280px"></ve-line>
            <div class="wm_market_card_datail_charts_empty type_cardinfo_dialog"
                 v-else>暂无价格历史数据</div>
          </div>
        </el-col>
      </el-row>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="goMarket">{{buyMode?'卡牌详情':'购卡或求卡'}}</el-button>
        <el-button @click="cardInfoShow = false">关闭</el-button>
      </span>
    </el-dialog>
    <captcha @captchaShow="captchaDigShow"
             @send="sendCaptcha"
             :codeDigShow="captchaShow"
             v-if="captchaShow"
             ref="captch"></captcha>
  </div>
</template>

<script>
import { authApi } from "../api"
import VeLine from 'v-charts/lib/line.common';
import captcha from "../components/captcha";

export default {
  props: {
    cardInfoDigShow: {
      type: Boolean,
      default: false
    },
    cardData: {
      type: Object,
      default: null
    },
  },
  data () {
    return {
      txDays: new Date().getDate(),
      buyFLag: false,
      buyId: '',
      captchaShow: false,
      wantPrice: 0,
      buyPage: 1,
      buyMode: false,
      loadingMarket: false,
      cardList: [],
      cardTotle: 0,
      cardInfoShow: this.cardInfoDigShow,
      token: sessionStorage.getItem("token") ? sessionStorage.getItem("token") : localStorage.getItem("token"),
      extend: {
        xAxis: {
          axisLabel: {
            formatter (v) {
              return v.split('丨')[0]
            },
            rotate: 45
          },
        }
      },
      chartSettings: {
        labelMap: {
          'highPrice': '最高价',
          'lowPrice': '最低价'
        },
      },
      chartData: {
        columns: ['time', 'highPrice', 'lowPrice'],
        rows: [
        ]
      },
      colors: ['#FF4C4C', '#1E90FF']
    }
  },
  mounted () {
    if (this.cardData) {
      this.getChart();
      this.getUserMarket();
      this.resetData();
    }
  },
  components: {
    VeLine,
    captcha
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
          name = '红火';
          break;
        case 2:
          name = '蓝水';
          break;
        case 3:
          name = '绿风';
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
  watch: {
    cardData (v) {
      if (v) {
        this.getChart();
        this.getUserMarket();
        this.resetData();
      }
    },
    cardInfoDigShow (v) {
      this.cardInfoShow = v;
    },
    cardInfoShow (v) {
      this.$emit('cardInfoShow', v);
    },
    codeDigShow (val) {
      this.cardInfoShow = val;
    }
  },
  methods: {
    wantCard () {
      this.buyFLag = false;
      this.captchaShow = true;
    },
    buyCard (info) {
      this.buyId = info._id;
      this.buyFLag = true;
      this.captchaShow = true;
    },
    sendCaptcha (v) {
      //   买卡或求卡
      if (this.buyFLag) {
        // 买卡
        let params = {
          captcha: v,
          type: 'buy',
          token: this.token,
          id: this.buyId
        }
        authApi.marketbuy(params).then(res => {
          this.$refs.captch.captchaUpdata();
          if (res.data.code == 0) {
            this.$message.error(res.data.msg);
          } else if (res.data.code == 1) {
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.$emit('updateUserinfo', true);
            this.captchaShow = false;
            this.getUserMarket();
            this.$emit('buyNewCard', true);
          }
        });
      } else {
        // 求卡
        let params = {
          token: this.token,
          price: this.wantPrice,
          captcha: v,
          cardId: this.cardData.cardId
        }
        authApi.wantcard(params).then(res => {
          this.$refs.captch.captchaUpdata();
          if (res.data.code == 0) {
            this.$message.error(res.data.msg);
          } else if (res.data.code == 1) {
            if (res.data.error.length > 0) {
              this.$message.error(res.data.error[0]["info"]);
            } else {
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
            }
            this.captchaShow = false;
          }
        });
      }
    },
    captchaDigShow (v) {
      this.captchaShow = v;
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
    cardPageChange (p) {
      this.buyPage = p;
      this.getUserMarket();
    },
    getUserMarket () {
      let params = {
        type: 'search',
        token: this.token,
        page: this.buyPage,
        name: "cardId",
        text: this.cardData.cardId,
        star: "0",
        sort: "0",
        have: "0",
        packageId: this.cardData.packageId
      }
      this.loadingMarket = true;
      authApi.marketbuy(params).then(res => {
        console.log(res);
        this.loadingMarket = false;
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          if (res.data.data.length === 0 && this.buyPage !== 1) {
            this.buyPage = 1;
            this.getUserMarket();
          } else {
            this.cardList = [];
            this.cardList = res.data.data;
            this.cardTotle = res.data.totle;
          }
        }
      });
    },
    resetChart () {
      this.chartData = {
        columns: ['time', 'highPrice', 'lowPrice'],
        rows: []
      }
    },
    resetData () {
      this.price = this.minPriceCal(this.cardData.star);
      this.buyFLag = false;
      this.buyId = '';
      this.captchaShow = false;
      this.wantPrice = 0;
      this.buyPage = 1;
      this.buyMode = false;
      this.cardList = [];
      this.cardTotle = 0;
    },
    capitalize (value) {
      var date = new Date(parseInt(value * 1000));
      var tt = [((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1), (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())].join('-') + '  ' + [(date.getHours() < 10 ? '0' + date.getHours() : date.getHours()), (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()), (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())].join(':');
      return tt;
    },
    getChart () {
      this.resetChart();
      let params = {
        token: this.token,
        cardId: this.cardData.cardId
      }
      authApi.marketchart(params).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          let chartDataRow = res.data.data.reverse();
          for (let i = 0; i < chartDataRow.length; i++) {
            console.log(chartDataRow);
            chartDataRow[i].time = this.capitalize(chartDataRow[i].time);
          }
          const dataCache = {
            rows: chartDataRow
          }
          this.chartData.rows = this.dataConvert(dataCache, "time").rows;
        }
      });
    },
    goMarket () {
      this.buyMode = !this.buyMode;
      // this.$router.push({ 
      //     name:'buyCard',
      //     query: {
      //         name:'cardId',
      //         text:this.cardData.cardId,
      //         want:1,
      //         wantstar:this.cardData.star,
      //         wantid:this.cardData.cardId,
      //         packageId:this.cardData.packageId
      //     }
      // });
    },
    dataConvert (d, index_) {
      const keys = []
      let num = 2
      d.rows.forEach(row => {
        if (~keys.indexOf(row[index_])) {
          row[index_] += `丨${num++}`
        } else {
          keys.push(row[index_])
        }
      })
      return d
    }
  }
}
</script>

<style scoped>
.wm_handbook_cardname {
  padding: 5px 15px;
}
.wm_handbook_cardinfo_body {
  border: 1px solid #ccc;
  padding: 10px 15px;
  border-radius: 5px;
  line-height: 24px;
  font-size: 16px;
}
.wm_handbook_cardinfo_item {
  margin-bottom: 10px;
}
.wm_handbook_auther_tx {
  width: 50px;
  height: 50px;
  border-radius: 2px;
}
.wm_handbook_info_img {
  max-width: 100%;
  width: 100%;
  height: auto;
}
.wm_market_card_datail_charts.type_cardinfo_dialog {
  max-height: 220px;
  overflow: hidden;
}
.wm_market_card_datail_charts_empty.type_cardinfo_dialog {
  box-shadow: none;
}
.wm_cardinfo_wantcard_body {
  border: 1px solid #ebeef5;
  border-radius: 5px;
  padding: 10px;
}
.wm_handbook_cardinfo_body.type_cardinfo {
  line-height: 20px;
  font-size: 14px;
}
</style>
<style>
/* .wm_cardinfo_dialog{
    z-index: 5000!important;
} */
</style>