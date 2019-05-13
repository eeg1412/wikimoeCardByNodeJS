<template>
  <div class="wm_card_rank_body" id="wmCardRankBody">
    <el-carousel :interval="4000" :type="card" height="414px" v-if="changed" :indicator-position="'outside'" :arrow="'never'" :trigger="'click'">
      <el-carousel-item>
        <div class="wm_card_rank_item_box" id="wmDeminingRankBox">
          <h5 class="wm_card_chiose_title" id="wm_card_rank_title">掘星排行榜</h5>
          <p class="wm_card_rank_last_updata">
            最后更新：
            <span class="wm_card_rank_last_time">2019年5月13日 11时</span>
          </p>
          <div class="wm_card_rank_list">
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">1st</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/fcd2f50ff3096a29dd37b139b54d81fe?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="fcd2f50ff3096a29dd37b139b54d81fe"
                >
              </div>
              <div class="fr wm_card_rank_point">10452颗星星</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">6th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/d22eb460ecab37fcd7205e6a3c55c228?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="d22eb460ecab37fcd7205e6a3c55c228"
                >
              </div>
              <div class="fr wm_card_rank_point">5434颗星星</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">2nd</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/95f3c59f0990cb8bb2888d49997e5579?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="95f3c59f0990cb8bb2888d49997e5579"
                >
              </div>
              <div class="fr wm_card_rank_point">8990颗星星</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">7th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/acd29ad6d5d1df37a1bc107ce8228e04?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="acd29ad6d5d1df37a1bc107ce8228e04"
                >
              </div>
              <div class="fr wm_card_rank_point">4184颗星星</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">3rd</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/d474a032fb48ae0b6c88ca0fb8c1e45d?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="d474a032fb48ae0b6c88ca0fb8c1e45d"
                >
              </div>
              <div class="fr wm_card_rank_point">7984颗星星</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">8th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/5e6892e999ca8c85a358d21164167f38?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="5e6892e999ca8c85a358d21164167f38"
                >
              </div>
              <div class="fr wm_card_rank_point">4093颗星星</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">4th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/fdce61cf9cc17461b2bccec659480671?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="fdce61cf9cc17461b2bccec659480671"
                >
              </div>
              <div class="fr wm_card_rank_point">7089颗星星</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">9th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/028249fb6ddcab5f9aff3b10cb64dfda?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="028249fb6ddcab5f9aff3b10cb64dfda"
                >
              </div>
              <div class="fr wm_card_rank_point">3774颗星星</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">5th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/a03c5322809e85b203f483459f84e9a3?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="a03c5322809e85b203f483459f84e9a3"
                >
              </div>
              <div class="fr wm_card_rank_point">5768颗星星</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">10th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/0eb6a88ec01787035d6bc1f574ea2d76?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="0eb6a88ec01787035d6bc1f574ea2d76"
                >
              </div>
              <div class="fr wm_card_rank_point">3706颗星星</div>
            </div>
          </div>
        </div>
      </el-carousel-item>

      <el-carousel-item>
        <div class="wm_card_rank_item_box" id="wmScoreRankBox">
          <h5 class="wm_card_chiose_title" id="wm_card_rank_title">竞技点排行榜</h5>
          <p class="wm_card_rank_last_updata">
            最后更新：
            <span class="wm_card_rank_last_time">2019年5月13日 11时</span>
          </p>
          <div class="wm_card_rank_list">
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">1st</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/fdce61cf9cc17461b2bccec659480671?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="fdce61cf9cc17461b2bccec659480671"
                >
              </div>
              <div class="fr wm_card_rank_point">2609点</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">6th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/d22eb460ecab37fcd7205e6a3c55c228?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="d22eb460ecab37fcd7205e6a3c55c228"
                >
              </div>
              <div class="fr wm_card_rank_point">1890点</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">2nd</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/95f3c59f0990cb8bb2888d49997e5579?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="95f3c59f0990cb8bb2888d49997e5579"
                >
              </div>
              <div class="fr wm_card_rank_point">2517点</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">7th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/b7f56e9db1e5a08163a5925dfa9f90b3?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="b7f56e9db1e5a08163a5925dfa9f90b3"
                >
              </div>
              <div class="fr wm_card_rank_point">1862点</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">3rd</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/d474a032fb48ae0b6c88ca0fb8c1e45d?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="d474a032fb48ae0b6c88ca0fb8c1e45d"
                >
              </div>
              <div class="fr wm_card_rank_point">2489点</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">8th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/32f80069342e2b8e8667c4d6556e1815?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="32f80069342e2b8e8667c4d6556e1815"
                >
              </div>
              <div class="fr wm_card_rank_point">1858点</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">4th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/fcd2f50ff3096a29dd37b139b54d81fe?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="fcd2f50ff3096a29dd37b139b54d81fe"
                >
              </div>
              <div class="fr wm_card_rank_point">2306点</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">9th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/5e6892e999ca8c85a358d21164167f38?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="5e6892e999ca8c85a358d21164167f38"
                >
              </div>
              <div class="fr wm_card_rank_point">1846点</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">5th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/0eb6a88ec01787035d6bc1f574ea2d76?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="0eb6a88ec01787035d6bc1f574ea2d76"
                >
              </div>
              <div class="fr wm_card_rank_point">2297点</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">10th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/5b855b510bc9014b9c95a05478c6b8a8?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="5b855b510bc9014b9c95a05478c6b8a8"
                >
              </div>
              <div class="fr wm_card_rank_point">1819点</div>
            </div>
          </div>
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div class="wm_card_rank_item_box" id="wmLevelRankBox">
          <h5 class="wm_card_chiose_title" id="wm_card_rank_title">等级排行榜</h5>
          <p class="wm_card_rank_last_updata">
            最后更新：
            <span class="wm_card_rank_last_time">2019年5月13日 11时</span>
          </p>
          <div class="wm_card_rank_list">
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">1st</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/fcd2f50ff3096a29dd37b139b54d81fe?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="fcd2f50ff3096a29dd37b139b54d81fe"
                >
              </div>
              <div class="fr wm_card_rank_point">29级</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">6th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/a03c5322809e85b203f483459f84e9a3?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="a03c5322809e85b203f483459f84e9a3"
                >
              </div>
              <div class="fr wm_card_rank_point">19级</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">2nd</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/95f3c59f0990cb8bb2888d49997e5579?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="95f3c59f0990cb8bb2888d49997e5579"
                >
              </div>
              <div class="fr wm_card_rank_point">27级</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">7th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/0eb6a88ec01787035d6bc1f574ea2d76?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="0eb6a88ec01787035d6bc1f574ea2d76"
                >
              </div>
              <div class="fr wm_card_rank_point">18级</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">3rd</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/d474a032fb48ae0b6c88ca0fb8c1e45d?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="d474a032fb48ae0b6c88ca0fb8c1e45d"
                >
              </div>
              <div class="fr wm_card_rank_point">26级</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">8th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/fbb31d99a24cf9a56c48b44dd0797d22?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="fbb31d99a24cf9a56c48b44dd0797d22"
                >
              </div>
              <div class="fr wm_card_rank_point">16级</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">4th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/fdce61cf9cc17461b2bccec659480671?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="fdce61cf9cc17461b2bccec659480671"
                >
              </div>
              <div class="fr wm_card_rank_point">24级</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">9th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/5e6892e999ca8c85a358d21164167f38?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="5e6892e999ca8c85a358d21164167f38"
                >
              </div>
              <div class="fr wm_card_rank_point">16级</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">5th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/d22eb460ecab37fcd7205e6a3c55c228?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="d22eb460ecab37fcd7205e6a3c55c228"
                >
              </div>
              <div class="fr wm_card_rank_point">20级</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">10th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/acd29ad6d5d1df37a1bc107ce8228e04?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="acd29ad6d5d1df37a1bc107ce8228e04"
                >
              </div>
              <div class="fr wm_card_rank_point">14级</div>
            </div>
          </div>
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div class="wm_card_rank_item_box" id="wmCardRankBox">
          <h5 class="wm_card_chiose_title" id="wm_card_rank_title">卡牌收集排行榜</h5>
          <p class="wm_card_rank_last_updata">
            最后更新：
            <span class="wm_card_rank_last_time">2019年5月13日 11时</span>
          </p>
          <div class="wm_card_rank_list">
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">1st</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/95f3c59f0990cb8bb2888d49997e5579?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="95f3c59f0990cb8bb2888d49997e5579"
                >
              </div>
              <div class="fr wm_card_rank_point">259种卡牌</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">6th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/acd29ad6d5d1df37a1bc107ce8228e04?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="acd29ad6d5d1df37a1bc107ce8228e04"
                >
              </div>
              <div class="fr wm_card_rank_point">228种卡牌</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">2nd</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/fdce61cf9cc17461b2bccec659480671?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="fdce61cf9cc17461b2bccec659480671"
                >
              </div>
              <div class="fr wm_card_rank_point">259种卡牌</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">7th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/5e6892e999ca8c85a358d21164167f38?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="5e6892e999ca8c85a358d21164167f38"
                >
              </div>
              <div class="fr wm_card_rank_point">226种卡牌</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">3rd</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/fcd2f50ff3096a29dd37b139b54d81fe?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="fcd2f50ff3096a29dd37b139b54d81fe"
                >
              </div>
              <div class="fr wm_card_rank_point">258种卡牌</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">8th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/fbb31d99a24cf9a56c48b44dd0797d22?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="fbb31d99a24cf9a56c48b44dd0797d22"
                >
              </div>
              <div class="fr wm_card_rank_point">224种卡牌</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">4th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/d474a032fb48ae0b6c88ca0fb8c1e45d?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="d474a032fb48ae0b6c88ca0fb8c1e45d"
                >
              </div>
              <div class="fr wm_card_rank_point">254种卡牌</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">9th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/e70291a80fa9fd8574c784df5c7c5ca1?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="e70291a80fa9fd8574c784df5c7c5ca1"
                >
              </div>
              <div class="fr wm_card_rank_point">213种卡牌</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">5th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/a03c5322809e85b203f483459f84e9a3?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="a03c5322809e85b203f483459f84e9a3"
                >
              </div>
              <div class="fr wm_card_rank_point">229种卡牌</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">10th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/0eb6a88ec01787035d6bc1f574ea2d76?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="0eb6a88ec01787035d6bc1f574ea2d76"
                >
              </div>
              <div class="fr wm_card_rank_point">213种卡牌</div>
            </div>
          </div>
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div class="wm_card_rank_item_box" id="wmDeminingRankBox">
          <h5 class="wm_card_chiose_title" id="wm_card_rank_title">掘星排行榜</h5>
          <p class="wm_card_rank_last_updata">
            最后更新：
            <span class="wm_card_rank_last_time">2019年5月13日 11时</span>
          </p>
          <div class="wm_card_rank_list">
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">1st</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/fcd2f50ff3096a29dd37b139b54d81fe?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="fcd2f50ff3096a29dd37b139b54d81fe"
                >
              </div>
              <div class="fr wm_card_rank_point">10452颗星星</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">6th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/d22eb460ecab37fcd7205e6a3c55c228?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="d22eb460ecab37fcd7205e6a3c55c228"
                >
              </div>
              <div class="fr wm_card_rank_point">5434颗星星</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">2nd</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/95f3c59f0990cb8bb2888d49997e5579?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="95f3c59f0990cb8bb2888d49997e5579"
                >
              </div>
              <div class="fr wm_card_rank_point">8990颗星星</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">7th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/acd29ad6d5d1df37a1bc107ce8228e04?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="acd29ad6d5d1df37a1bc107ce8228e04"
                >
              </div>
              <div class="fr wm_card_rank_point">4184颗星星</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">3rd</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/d474a032fb48ae0b6c88ca0fb8c1e45d?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="d474a032fb48ae0b6c88ca0fb8c1e45d"
                >
              </div>
              <div class="fr wm_card_rank_point">7984颗星星</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">8th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/5e6892e999ca8c85a358d21164167f38?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="5e6892e999ca8c85a358d21164167f38"
                >
              </div>
              <div class="fr wm_card_rank_point">4093颗星星</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">4th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/fdce61cf9cc17461b2bccec659480671?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="fdce61cf9cc17461b2bccec659480671"
                >
              </div>
              <div class="fr wm_card_rank_point">7089颗星星</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">9th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/028249fb6ddcab5f9aff3b10cb64dfda?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="028249fb6ddcab5f9aff3b10cb64dfda"
                >
              </div>
              <div class="fr wm_card_rank_point">3774颗星星</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">5th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/a03c5322809e85b203f483459f84e9a3?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="a03c5322809e85b203f483459f84e9a3"
                >
              </div>
              <div class="fr wm_card_rank_point">5768颗星星</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">10th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/0eb6a88ec01787035d6bc1f574ea2d76?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="0eb6a88ec01787035d6bc1f574ea2d76"
                >
              </div>
              <div class="fr wm_card_rank_point">3706颗星星</div>
            </div>
          </div>
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div class="wm_card_rank_item_box" id="wmScoreRankBox">
          <h5 class="wm_card_chiose_title" id="wm_card_rank_title">竞技点排行榜</h5>
          <p class="wm_card_rank_last_updata">
            最后更新：
            <span class="wm_card_rank_last_time">2019年5月13日 11时</span>
          </p>
          <div class="wm_card_rank_list">
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">1st</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/fdce61cf9cc17461b2bccec659480671?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="fdce61cf9cc17461b2bccec659480671"
                >
              </div>
              <div class="fr wm_card_rank_point">2609点</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">6th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/d22eb460ecab37fcd7205e6a3c55c228?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="d22eb460ecab37fcd7205e6a3c55c228"
                >
              </div>
              <div class="fr wm_card_rank_point">1890点</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">2nd</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/95f3c59f0990cb8bb2888d49997e5579?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="95f3c59f0990cb8bb2888d49997e5579"
                >
              </div>
              <div class="fr wm_card_rank_point">2517点</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">7th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/b7f56e9db1e5a08163a5925dfa9f90b3?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="b7f56e9db1e5a08163a5925dfa9f90b3"
                >
              </div>
              <div class="fr wm_card_rank_point">1862点</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">3rd</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/d474a032fb48ae0b6c88ca0fb8c1e45d?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="d474a032fb48ae0b6c88ca0fb8c1e45d"
                >
              </div>
              <div class="fr wm_card_rank_point">2489点</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">8th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/32f80069342e2b8e8667c4d6556e1815?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="32f80069342e2b8e8667c4d6556e1815"
                >
              </div>
              <div class="fr wm_card_rank_point">1858点</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">4th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/fcd2f50ff3096a29dd37b139b54d81fe?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="fcd2f50ff3096a29dd37b139b54d81fe"
                >
              </div>
              <div class="fr wm_card_rank_point">2306点</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">9th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/5e6892e999ca8c85a358d21164167f38?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="5e6892e999ca8c85a358d21164167f38"
                >
              </div>
              <div class="fr wm_card_rank_point">1846点</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">5th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/0eb6a88ec01787035d6bc1f574ea2d76?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="0eb6a88ec01787035d6bc1f574ea2d76"
                >
              </div>
              <div class="fr wm_card_rank_point">2297点</div>
            </div>
            <div class="clearfix wm_card_rank_box" title="查看TA的卡牌">
              <div class="fl wm_card_rank_text">10th</div>
              <div class="fl wm_card_rank_img">
                <img
                  class="wm_card_get_list_avatar_pic"
                  src="https://cdn.v2ex.com/gravatar/5b855b510bc9014b9c95a05478c6b8a8?s=100&amp;d=mm&amp;r=g&amp;d=robohash"
                  width="45"
                  height="45"
                  data-md5="5b855b510bc9014b9c95a05478c6b8a8"
                >
              </div>
              <div class="fr wm_card_rank_point">1819点</div>
            </div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  data() {
    return {
        card:'card',
        changed:true,
    };
  },
  created() {
    this.setCard(); 
  },
  mounted() {
    window.addEventListener('resize', this.setCard);
  },
  methods: {
      setCard(){
          let w = window.innerWidth;
          if(w>768){
              if(this.card===''){
                  this.changed = false;
                  this.card = 'card';
                  setTimeout(()=>{
                    this.changed = true;
                  },20) 
              }
          }else{
              if(this.card==='card'){
                this.changed = false;
                this.card = '';
                setTimeout(()=>{
                    this.changed = true;
                },20) 
              }
          }
      }
  },
  beforeDestroy(){
    window.removeEventListener('resize', this.setCard);
  }
};
</script>

<style lang="stylus" scoped></style>
