<template>
  <div class="wm_market_content_body">
    <div class="wm_market_card_datail_body">
      <div class="wm_market_card_datail_img_body">
        <img class="wm_market_card_detail_img"
             :src="$wikimoecard.url+packageId+'/'+cardIdFormat+'.jpg'">
      </div>
      <div class="wm_market_card_datail_info_body">
        <div class="wm_market_card_datail_price"
             v-if="sellPrice">售价：{{sellPrice}}星星</div>
        <div class="wm_market_card_datail_info_box">
          <div><span class="fb">卡牌ID：</span>{{cardId}}</div>
          <div><span class="fb">卡牌人物：</span>{{cardData.name}}</div>
          <div><span class="fb">出自作品：</span>《{{cardData.title}}》</div>
          <div><span class="fb">星级：</span>{{cardData.star}}星</div>
          <div v-if="have!=undefined"><span class="fb">持有：</span>{{have}}张</div>
          <div v-if="uptime"><span class="fb">上架时间：</span>{{uptime | capitalize}}</div>
        </div>
        <div class="wm_market_card_datail_captcha"
             v-if="type=='buy'">
          <el-input placeholder="请输入计算结果"
                    v-model="captcha"
                    type="tel">
            <template slot="append"><img class="reg_code_img"
                   :src="captchaSrc"
                   @click="captchaUpdata"></template>
          </el-input>
        </div>
        <div v-if="type=='buy'">
          <el-button type="primary"
                     class="wm_market_card_datail_buy_btn"
                     @click="buyCard()">购买</el-button>
        </div>
        <div class="wm_market_card_datail_set_body"
             v-if="type=='sell'">
          <div class="wm_market_card_datail_tips"
               v-if="stat==1 || stat==0">tips:将会收取售价的10%作为手续费。卡牌上架后会在30天后过期。</div>
          <div class="wm_market_card_datail_price_input"
               v-if="stat==1 || stat==0">
            <el-input-number class="wm_market_card_datail_price_input_box"
                             size="medium"
                             v-model="price"
                             :precision="0"
                             :step="1"
                             :max="99999999"
                             :min="minPrice"></el-input-number>
          </div>
          <div class="wm_market_card_datail_tips"
               v-if="stat==1 || stat==0">您将获得：{{price | getPrice}} 星星</div>
          <div class="wm_market_card_datail_captcha">
            <el-input placeholder="请输入计算结果"
                      v-model="captcha"
                      type="tel">
              <template slot="append"><img class="reg_code_img"
                     :src="captchaSrc"
                     @click="captchaUpdata"></template>
            </el-input>
          </div>
          <div class="wm_market_card_datail_btn"
               v-if="stat==0">
            <el-button type="primary"
                       class="wm_market_card_datail_price_input_box"
                       @click="upCard()">上架</el-button>
          </div>
          <div class="wm_market_card_datail_btn"
               v-if="stat==1">
            <el-button type="primary"
                       class="wm_market_card_datail_price_input_box"
                       @click="update()">更新</el-button>
          </div>
          <div class="wm_market_card_datail_btn"
               v-if="stat==1">
            <el-button class="wm_market_card_datail_price_input_box"
                       @click="downCard()">下架</el-button>
          </div>
        </div>
        <div v-if="stat==2">
          <el-button type="primary"
                     class="wm_market_card_datail_buy_btn"
                     @click="getstar()">收取星星</el-button>
        </div>
      </div>
    </div>
    <h5 class="common_title type_shop">价格走势</h5>
    <div class="wm_market_card_datail_charts">
      <ve-line :data="chartData"
               :settings="chartSettings"
               :extend="extend"
               v-if="chartData.rows.length>0"
               :colors="colors"></ve-line>
      <div class="wm_market_card_datail_charts_empty"
           v-else>暂无价格历史数据</div>
    </div>
    <div v-if="!(wantLog.length==0&&logPage==1)">
      <h5 class="common_title type_shop">求购信息</h5>
      <div class="wm_card_get_list_item"
           v-for="(item,index) in wantLog"
           v-bind:key="index+1">
        <div class="wm_card_get_list_avatar">
          <el-tooltip class="item"
                      effect="dark"
                      :content="'查看'+item.nickName+'的卡牌'"
                      placement="top"
                      :hide-after="3000">
            <img class="wm_card_get_list_avatar_pic"
                 :src="'/api/gravatar.png?md5='+item.md5"
                 width="45"
                 height="45"
                 @click="watchUserCard(item.md5)">
          </el-tooltip>
        </div>
        <div class="wm_card_get_list_comment">
          <p>
            <span class="wm_log_name">{{item.nickName}}</span>
            <span class="wm_log_time">{{item.time|capitalize}}</span>
          </p>
          <p>
            <span>我愿意用<span class="cOrange fb">{{item.wantPrice}}</span>颗左右的星星，去换购出自作品《{{item.title}}》的{{item.name}}。不知道有没有大佬愿意在市场上架这张卡牌！
            </span>
          </p>
        </div>
      </div>
      <div class="log_page">
        <el-pagination small
                       layout="prev, pager, next"
                       :total="logListTotal"
                       @current-change="logPageChange"
                       :current-page.sync="logPage"
                       :page-size="5"
                       class="my_card_page">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { PrefixInteger } from "../../../utils/utils";
import { authApi } from "../../api";
import VeLine from 'v-charts/lib/line.common'

export default {
  data () {
    return {
      txDays: new Date().getDate(),
      logListTotal: 0,
      logPage: 1,
      wantLog: [],
      fromFullPath: '/',
      captchaSrc: '/api/captcha?time=' + new Date().getTime(),
      cardData: {
        star: this.$route.query.star,
        title: decodeURIComponent(this.$route.query.title || ''),
        name: decodeURIComponent(this.$route.query.name || ''),
      },
      token: sessionStorage.getItem("token") ? sessionStorage.getItem("token") : localStorage.getItem("token"),
      cardId: 1,
      cardIdFormat: 1,
      type: 'buy',
      captcha: '',
      id: '',// 交易ID
      packageId: this.$route.query.packageId || '0',//卡包
      sellPrice: 0,//售价
      price: 0,//设定售价
      minPrice: 0,//最小售价
      uptime: null,//上架时间
      stat: undefined,//卖卡状态
      have: this.$route.query.have,
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
  components: {
    VeLine
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.fromFullPath = from.fullPath
    })
  },
  filters: {
    capitalize (value) {
      var date = new Date(parseInt(value * 1000));
      var tt = [date.getFullYear(), ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1), (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())].join('-') + '  ' + [(date.getHours() < 10 ? '0' + date.getHours() : date.getHours()), (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()), (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())].join(':');
      return tt;
    },
    getPrice (value) {
      let getPriceNum = Math.floor(value * 0.9);
      if (isNaN(getPriceNum)) {
        getPriceNum = 0;
      }
      return getPriceNum;
    }
  },
  created () {
    let type = this.$route.query.type;
    let cardId = this.$route.query.card;
    if (!type || !cardId) {
      this.$router.push({ path: '/' });
      return false;
    }
    this.uptime = this.$route.query.time;
    this.stat = this.$route.query.stat;
    this.cardId = cardId;
    this.id = this.$route.query.id;
    this.sellPrice = this.$route.query.price;
    if (this.sellPrice) {
      this.price = this.sellPrice;
    }
    this.cardIdFormat = cardId;
    this.type = type;
    // 计算最低售价
    if (this.cardData.star == 6) {
      this.minPrice = 600;
    } else if (this.cardData.star == 5) {
      this.minPrice = 200;
    } else if (this.cardData.star == 4) {
      this.minPrice = 90;
    } else {
      this.minPrice = 30;
    }
    this.getChart();
    if (type == 'sell') {
      this.getWant();
    }
  },
  methods: {
    watchUserCard (md5) {
      this.$router.push({
        path: '/',
        query: { md5: md5 }
      });
    },
    getWant () {
      let params = {
        cardId: this.cardId,
        page: this.logPage,
        token: this.token
      }
      authApi.searchwantcard(params).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.wantLog = res.data.data;
          this.logListTotal = res.data.total;
        }
      })
    },
    logPageChange (val) {
      this.logPage = val;
      this.getWant();
    },
    buyCard () {
      let params = {
        captcha: this.captcha,
        type: 'buy',
        token: this.token,
        id: this.id
      }
      authApi.marketbuy(params).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.$message({
            message: res.data.msg,
            type: 'success'
          });
          this.$emit('updateUserinfo');
          this.$router.replace({ path: this.fromFullPath });
        }
        this.captchaUpdata();
      });
    },
    getChart () {
      let params = {
        token: this.token,
        cardId: this.cardId
      }
      authApi.marketchart(params).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          let chartDataRow = res.data.data.reverse();
          for (let i = 0; i < chartDataRow.length; i++) {
            chartDataRow[i].time = this.capitalize(chartDataRow[i].time);
          }
          const dataCache = {
            rows: chartDataRow
          }
          this.chartData.rows = this.dataConvert(dataCache, "time").rows;
        }
      });
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
    },
    getstar () {
      let params = {
        type: 'getstar',
        captcha: this.captcha,
        id: this.id,
        token: this.token
      }
      authApi.marketsell(params).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.$message({
            message: res.data.msg,
            type: 'success'
          });
          this.$emit('updateUserinfo');
          this.$router.replace({ path: this.fromFullPath });
        }
        this.captchaUpdata();
      });
    },
    downCard () {
      let params = {
        type: 'down',
        captcha: this.captcha,
        id: this.id,
        token: this.token
      }
      authApi.marketsell(params).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.$message({
            message: res.data.msg,
            type: 'success'
          });
          this.$router.replace({ path: this.fromFullPath });
        }
        this.captchaUpdata();
      });
    },
    update () {
      let params = {
        type: 'update',
        price: this.price,
        captcha: this.captcha,
        id: this.id,
        token: this.token
      }
      authApi.marketsell(params).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.$message({
            message: res.data.msg,
            type: 'success'
          });
          this.$router.replace({ path: this.fromFullPath });
        }
        this.captchaUpdata();
      });
    },
    upCard () {
      let params = {
        type: 'up',
        price: this.price,
        cardId: this.cardId,
        captcha: this.captcha,
        token: this.token
      }
      authApi.marketsell(params).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.$message({
            message: res.data.msg,
            type: 'success'
          });
          this.$router.replace({ path: this.fromFullPath });
        }
        this.captchaUpdata();
      });
    },
    captchaUpdata () {
      this.captchaSrc = '/api/captcha?time=' + new Date().getTime();
    },
    PrefixInteger_ (num, length) {
      return PrefixInteger(num, length);
    },
    capitalize (value) {
      var date = new Date(parseInt(value * 1000));
      var tt = [((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1), (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())].join('-') + '  ' + [(date.getHours() < 10 ? '0' + date.getHours() : date.getHours()), (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()), (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())].join(':');
      return tt;
    }
  }
}
</script>

<style lang="stylus" scoped></style>
