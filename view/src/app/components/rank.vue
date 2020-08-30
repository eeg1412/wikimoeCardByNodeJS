<template>
  <div class="wm_card_rank_body"
       id="wmCardRankBody"
       v-if="changed && rankData"
       @mouseenter="$wikimoecard.l2dMassage('这些排行榜中的大佬们真是太厉害了呢！')">
    <el-carousel :interval="4000"
                 :type="card"
                 height="420px"
                 :indicator-position="'outside'"
                 :arrow="'never'"
                 :trigger="'click'"
                 v-if="rankData.cardIndexCount.length>=5">
      <el-carousel-item>
        <div class="wm_card_rank_item_box"
             id="wmCardRankBox">
          <h5 class="wm_card_chiose_title"
              id="wm_card_rank_title">卡牌收集排行榜</h5>
          <p class="wm_card_rank_last_updata">
            最后更新：
            <span class="wm_card_rank_last_time">{{rankData.time|capitalize}}</span>
          </p>
          <div class="wm_card_rank_list">
            <div class="clearfix wm_card_rank_box"
                 v-for="(item,index) in rankData.cardIndexCount"
                 v-bind:key="index"
                 @click="watchInfo(item.md5)">
              <div class="fl wm_card_rank_text">{{index+1|rankTetx}}</div>
              <div class="fl wm_card_rank_img">
                <img class="wm_card_get_list_avatar_pic"
                     :src="'/api/gravatar.png?md5='+item.md5"
                     width="45"
                     height="45">
              </div>
              <div class="fl wm_card_nickname_text">{{item.nickName}}</div>
              <div class="fr wm_card_rank_point">{{item.cardIndexCount}}种卡牌</div>
            </div>
          </div>
        </div>
      </el-carousel-item>

      <el-carousel-item>
        <div class="wm_card_rank_item_box"
             id="wmDeminingRankBox">
          <h5 class="wm_card_chiose_title"
              id="wm_card_rank_title">星星榜</h5>
          <p class="wm_card_rank_last_updata">
            最后更新：
            <span class="wm_card_rank_last_time">{{rankData.time|capitalize}}</span>
          </p>
          <div class="wm_card_rank_list">
            <div class="clearfix wm_card_rank_box"
                 v-for="(item,index) in rankData.star"
                 v-bind:key="index"
                 @click="watchInfo(item.md5)">
              <div class="fl wm_card_rank_text">{{index+1|rankTetx}}</div>
              <div class="fl wm_card_rank_img">
                <img class="wm_card_get_list_avatar_pic"
                     :src="'/api/gravatar.png?md5='+item.md5"
                     width="45"
                     height="45">
              </div>
              <div class="fl wm_card_nickname_text">{{item.nickName}}</div>
              <div class="fr wm_card_rank_point">{{item.star|setBigNum}}颗星星</div>
            </div>
          </div>
        </div>
      </el-carousel-item>

      <el-carousel-item>
        <div class="wm_card_rank_item_box"
             id="wmDeminingRankBox">
          <h5 class="wm_card_chiose_title"
              id="wm_card_rank_title">掘星排行榜</h5>
          <p class="wm_card_rank_last_updata">
            最后更新：
            <span class="wm_card_rank_last_time">{{rankData.time|capitalize}}</span>
          </p>
          <div class="wm_card_rank_list">
            <div class="clearfix wm_card_rank_box"
                 v-for="(item,index) in rankData.deminingStarCount"
                 v-bind:key="index"
                 @click="watchInfo(item.md5)">
              <div class="fl wm_card_rank_text">{{index+1|rankTetx}}</div>
              <div class="fl wm_card_rank_img">
                <img class="wm_card_get_list_avatar_pic"
                     :src="'/api/gravatar.png?md5='+item.md5"
                     width="45"
                     height="45">
              </div>
              <div class="fl wm_card_nickname_text">{{item.nickName}}</div>
              <div class="fr wm_card_rank_point">{{item.deminingStarCount|setBigNum}}颗星星</div>
            </div>
          </div>
        </div>
      </el-carousel-item>

      <el-carousel-item>
        <div class="wm_card_rank_item_box"
             id="wmScoreRankBox">
          <h5 class="wm_card_chiose_title"
              id="wm_card_rank_title">竞技点排行榜</h5>
          <p class="wm_card_rank_last_updata">
            最后更新：
            <span class="wm_card_rank_last_time">{{rankData.time|capitalize}}</span>
          </p>
          <div class="wm_card_rank_list">
            <div class="clearfix wm_card_rank_box"
                 v-for="(item,index) in rankData.score"
                 v-bind:key="index"
                 @click="watchInfo(item.md5)">
              <div class="fl wm_card_rank_text">{{index+1|rankTetx}}</div>
              <div class="fl wm_card_rank_img">
                <img class="wm_card_get_list_avatar_pic"
                     :src="'/api/gravatar.png?md5='+item.md5"
                     width="45"
                     height="45">
              </div>
              <div class="fl wm_card_nickname_text">{{item.nickName}}</div>
              <div class="fr wm_card_rank_point">{{item.score}}点</div>
            </div>
          </div>
        </div>
      </el-carousel-item>

      <el-carousel-item>
        <div class="wm_card_rank_item_box"
             id="wmDeminingRankBox">
          <h5 class="wm_card_chiose_title"
              id="wm_card_rank_title">猜卡榜</h5>
          <p class="wm_card_rank_last_updata">
            最后更新：
            <span class="wm_card_rank_last_time">{{rankData.time|capitalize}}</span>
          </p>
          <div class="wm_card_rank_list">
            <div class="clearfix wm_card_rank_box"
                 v-for="(item,index) in rankData.guessCardCount"
                 v-bind:key="index"
                 @click="watchInfo(item.md5)">
              <div class="fl wm_card_rank_text">{{index+1|rankTetx}}</div>
              <div class="fl wm_card_rank_img">
                <img class="wm_card_get_list_avatar_pic"
                     :src="'/api/gravatar.png?md5='+item.md5"
                     width="45"
                     height="45">
              </div>
              <div class="fl wm_card_nickname_text">{{item.nickName}}</div>
              <div class="fr wm_card_rank_point">{{item.guessCardCount|setBigNum}}张卡牌</div>
            </div>
          </div>
        </div>
      </el-carousel-item>

      <el-carousel-item>
        <div class="wm_card_rank_item_box"
             id="wmLevelRankBox">
          <h5 class="wm_card_chiose_title"
              id="wm_card_rank_title">等级排行榜</h5>
          <p class="wm_card_rank_last_updata">
            最后更新：
            <span class="wm_card_rank_last_time">{{rankData.time|capitalize}}</span>
          </p>
          <div class="wm_card_rank_list">
            <div class="clearfix wm_card_rank_box"
                 v-for="(item,index) in rankData.level"
                 v-bind:key="index"
                 @click="watchInfo(item.md5)">
              <div class="fl wm_card_rank_text">{{index+1|rankTetx}}</div>
              <div class="fl wm_card_rank_img">
                <img class="wm_card_get_list_avatar_pic"
                     :src="'/api/gravatar.png?md5='+item.md5"
                     width="45"
                     height="45">
              </div>
              <div class="fl wm_card_nickname_text">{{item.nickName}}</div>
              <div class="fr wm_card_rank_point">{{item.level}}级</div>
            </div>
          </div>
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div class="wm_card_rank_item_box"
             id="wmLevelRankBox">
          <h5 class="wm_card_chiose_title"
              id="wm_card_rank_title">任务完成榜</h5>
          <p class="wm_card_rank_last_updata">
            最后更新：
            <span class="wm_card_rank_last_time">{{rankData.time|capitalize}}</span>
          </p>
          <div class="wm_card_rank_list">
            <div class="clearfix wm_card_rank_box"
                 v-for="(item,index) in rankData.questCount"
                 v-bind:key="index"
                 @click="watchInfo(item.md5)">
              <div class="fl wm_card_rank_text">{{index+1|rankTetx}}</div>
              <div class="fl wm_card_rank_img">
                <img class="wm_card_get_list_avatar_pic"
                     :src="'/api/gravatar.png?md5='+item.md5"
                     width="45"
                     height="45">
              </div>
              <div class="fl wm_card_nickname_text">{{item.nickName}}</div>
              <div class="fr wm_card_rank_point">完成{{item.questCount}}次</div>
            </div>
          </div>
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div class="wm_card_rank_item_box"
             id="wmLevelRankBox">
          <h5 class="wm_card_chiose_title"
              id="wm_card_rank_title">制卡榜</h5>
          <p class="wm_card_rank_last_updata">
            最后更新：
            <span class="wm_card_rank_last_time">{{rankData.time|capitalize}}</span>
          </p>
          <div class="wm_card_rank_list">
            <div class="clearfix wm_card_rank_box"
                 v-for="(item,index) in rankData.UCC"
                 v-bind:key="index"
                 @click="watchInfo(item.md5)">
              <div class="fl wm_card_rank_text">{{index+1|rankTetx}}</div>
              <div class="fl wm_card_rank_img">
                <img class="wm_card_get_list_avatar_pic"
                     :src="'/api/gravatar.png?md5='+item.md5"
                     width="45"
                     height="45">
              </div>
              <div class="fl wm_card_nickname_text">{{item.nickName}}</div>
              <div class="fr wm_card_rank_point">制卡{{item.UCC}}种</div>
            </div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import { authApi } from "../api";

export default {
  data () {
    return {
      txDays: new Date().getDate(),
      card: 'card',
      changed: true,
      rankData: null
    };
  },
  created () {
    this.getRank();
    this.setCard();
  },
  mounted () {
    window.addEventListener('resize', this.setCard);
  },
  filters: {
    setBigNum: function (v) {
      let n = Number(v);
      if (n >= 100000) {
        return Math.floor(n / 10000) + '万';
      } else {
        return v;
      }
    },
    rankTetx: function (v) {
      if (v == 1) {
        return '1st'
      } else if (v == 2) {
        return '2nd'
      } else if (v == 3) {
        return '3rd'
      } else {
        return v + 'th'
      }
    },
    capitalize: function (value) {
      var date = new Date(parseInt(value));
      var tt = [date.getFullYear(), ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1), (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())].join('-') + '  ' + [(date.getHours() < 10 ? '0' + date.getHours() : date.getHours()), (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()), (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())].join(':');
      return tt;
    }
  },
  methods: {
    watchInfo (md5) {
      this.$emit('watchInfo', md5);
    },
    getRank () {
      authApi.rank().then(res => {
        if (res.data.code == 1) {
          this.rankData = res.data.data;
          console.log(this.rankData);
        }
      });
    },
    setCard () {
      let w = window.innerWidth;
      if (w > 768) {
        if (this.card === '') {
          this.changed = false;
          this.card = 'card';
          setTimeout(() => {
            this.changed = true;
          }, 20)
        }
      } else {
        if (this.card === 'card') {
          this.changed = false;
          this.card = '';
          setTimeout(() => {
            this.changed = true;
          }, 20)
        }
      }
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.setCard);
  }
};
</script>

<style lang="stylus" scoped></style>
