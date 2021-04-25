<template>
  <div class="common_body">
    <userTop ref="userTop" />
    <h5 class="common_title type_shop">设置出战卡牌 <el-tooltip class="item"
                  effect="dark"
                  content="查看配卡帮助"
                  placement="top"><i class="el-icon-collection wm_set_pointer"
           @click="openTips"></i></el-tooltip>
    </h5>
    <div id="battlecardTable">
      <table class="wm_user_info_table type_battlecard">
        <thead>
          <tr>
            <th>攻</th>
            <th>防</th>
            <th>速</th>
            <th>SAN</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span v-show="selIndex!==null"
                    :class="{'cGreen1A7':ifADSHPSUM[0]<0,'cRed':ifADSHPSUM[0]>0}">{{ifADSHPSUM[0]>=0?'+':''}}{{ifADSHPSUM[0]}}<br /></span>{{ADSHP[0]}}</td>
            <td><span v-show="selIndex!==null"
                    :class="{'cGreen1A7':ifADSHPSUM[1]<0,'cRed':ifADSHPSUM[1]>0}">{{ifADSHPSUM[1]>=0?'+':''}}{{ifADSHPSUM[1]}}<br /></span>{{ADSHP[1]}}</td>
            <td><span v-show="selIndex!==null"
                    :class="{'cGreen1A7':ifADSHPSUM[2]<0,'cRed':ifADSHPSUM[2]>0}">{{ifADSHPSUM[2]>=0?'+':''}}{{ifADSHPSUM[2]}}<br /></span>{{ADSHP[2]}}</td>
            <td><span v-show="selIndex!==null"
                    :class="{'cGreen1A7':ifADSHPSUM[3]<0,'cRed':ifADSHPSUM[3]>0}">{{ifADSHPSUM[3]>=0?'+':''}}{{ifADSHPSUM[3]}}<br /></span>{{ADSHP[3]}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="wm_battlecard_table_fixed_body"
         v-show="fixedTable">
      <div class="wm_battlecard_table_fixed_box">
        <table class="wm_user_info_table type_battlecard">
          <thead>
            <tr>
              <th>攻</th>
              <th>防</th>
              <th>速</th>
              <th>SAN</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span v-show="selIndex!==null"
                      :class="{'cGreen1A7':ifADSHPSUM[0]<0,'cRed':ifADSHPSUM[0]>0}">{{ifADSHPSUM[0]>=0?'+':''}}{{ifADSHPSUM[0]}}<br /></span>{{ADSHP[0]}}</td>
              <td><span v-show="selIndex!==null"
                      :class="{'cGreen1A7':ifADSHPSUM[1]<0,'cRed':ifADSHPSUM[1]>0}">{{ifADSHPSUM[1]>=0?'+':''}}{{ifADSHPSUM[1]}}<br /></span>{{ADSHP[1]}}</td>
              <td><span v-show="selIndex!==null"
                      :class="{'cGreen1A7':ifADSHPSUM[2]<0,'cRed':ifADSHPSUM[2]>0}">{{ifADSHPSUM[2]>=0?'+':''}}{{ifADSHPSUM[2]}}<br /></span>{{ADSHP[2]}}</td>
              <td><span v-show="selIndex!==null"
                      :class="{'cGreen1A7':ifADSHPSUM[3]<0,'cRed':ifADSHPSUM[3]>0}">{{ifADSHPSUM[3]>=0?'+':''}}{{ifADSHPSUM[3]}}<br /></span>{{ADSHP[3]}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <el-collapse-transition>
      <div class="wm_battlecard_body"
           v-show="selIndex===null">
        <div class="wm_battlecard_list_body">
          <draggable v-model="myCard"
                     handle=".handle">
            <div class="wm_battlecard_list_box"
                 v-for="(item,index) in myCard"
                 v-bind:key="index+1">
              <el-tooltip class="item"
                          effect="dark"
                          content="拖动改变卡牌发动顺序"
                          placement="top">
                <div class="wm_battlecard_list_move handle"><i class="el-icon-rank cRed"></i></div>
              </el-tooltip>
              <div class="wm_battlecard_level cRed"
                   v-if="item">Lv.{{myCardLevel[item.cardId]?myCardLevel[item.cardId]+1:1}}</div>
              <div class="wm_battlecard_cardtip cRed"
                   v-if="item">
                <el-popover placement="top"
                            width="300"
                            trigger="click">
                  <div class="wm_battlecard_cardtip_body">
                    <p v-if="item.cry === 1">
                      <span>【红火】</span><br>
                      <span>与蓝水卡牌对战时会处于劣势，与绿风卡牌对战时会处于优势</span>
                    </p>
                    <p v-else-if="item.cry === 2">
                      <span>【蓝水】</span><br>
                      <span>与绿风卡牌对战时会处于劣势，与红火卡牌对战时会处于优势</span>
                    </p>
                    <p v-else-if="item.cry === 3">
                      <span>【绿风】</span><br>
                      <span>与红火卡牌对战时会处于劣势，与蓝水卡牌对战时会处于优势</span>
                    </p>
                    <p v-else-if="item.cry === 4">
                      <span>【光】</span><br>
                      <span>与暗卡牌相互克制</span>
                    </p>
                    <p v-else-if="item.cry === 5">
                      <span>【暗】</span><br>
                      <span>与光卡牌相互克制</span>
                    </p>

                    <p v-if="item.leftType === 1">
                      <span>【全能】</span><br>
                      <span>攻+{{50*(myCardLevel[item.cardId]?myCardLevel[item.cardId]+1:1)}}、防+{{25*(myCardLevel[item.cardId]?myCardLevel[item.cardId]+1:1)}}</span>
                    </p>
                    <p v-else-if="item.leftType === 2">
                      <span>【兵攻】</span><br>
                      <span>攻+{{100*(myCardLevel[item.cardId]?myCardLevel[item.cardId]+1:1)}}</span>
                    </p>
                    <p v-else-if="item.leftType === 3">
                      <span>【盾防】</span><br>
                      <span>防+{{50*(myCardLevel[item.cardId]?myCardLevel[item.cardId]+1:1)}}</span>
                    </p>
                    <p v-else-if="item.leftType === 4">
                      <span>【速度】</span><br>
                      <span>速+{{1*(myCardLevel[item.cardId]?myCardLevel[item.cardId]+1:1)}}</span>
                    </p>
                    <p v-else-if="item.leftType === 5">
                      <span>【爱心】</span><br>
                      <span>SAN+{{1150*(myCardLevel[item.cardId]?myCardLevel[item.cardId]+1:1)}}</span>
                    </p>

                    <p v-if="item.rightType === 1">
                      <span>【物】</span><br>
                      <span>攻击增加{{9*item.star}}%，并转换为物理攻击，攻防不会受到属性加减</span>
                    </p>
                    <p v-else-if="item.rightType === 2">
                      <span>【魔】</span><br>
                      <span>攻击增加{{9*item.star}}%，并转换为强力魔法攻击，攻防会很大程度受到属性影响</span>
                    </p>
                    <p v-else-if="item.rightType === 3">
                      <span>【防】</span><br>
                      <span>抵消{{10*item.star}}%*的伤害，并造成防御力的{{40*item.star}}%的攻击</span>
                    </p>
                    <p v-else-if="item.rightType === 4">
                      <span>【治】</span><br>
                      <span>解除异常状态，恢复攻的{{8*item.star}}%的SAN，接下来2回合恢复攻的{{4*item.star}}%的SAN</span>
                    </p>
                    <p v-else-if="item.rightType === 5">
                      <span>【妨】</span><br>
                      <span>使对方技能无效，概率为{{16*item.star}}%，降低对方{{10*(7-item.star)}}%的防御</span>
                    </p>
                    <p v-else-if="item.rightType === 6">
                      <span>【支】</span><br>
                      <span>下回合攻击增加{{11*item.star}}%*星级，防御力增加{{2*item.star}}%</span>
                    </p>
                    <p v-else-if="item.rightType === 7">
                      <span>【特】</span><br>
                      <span v-if="item.cry === 1">造成2回合持续伤害效果，伤害为攻的{{6*item.star}}%，如果卡牌为绿风则伤害为攻的{{6.5*item.star}}%</span>
                      <span v-else-if="item.cry === 2">造成2回合持续伤害效果，伤害为攻的{{6*item.star}}%，如果卡牌为红火则伤害为攻的{{6.5*item.star}}%</span>
                      <span v-else-if="item.cry === 3">造成2回合持续伤害效果，伤害为攻的{{6*item.star}}%，如果卡牌为蓝水则伤害为攻的{{6.5*item.star}}%</span>
                      <span v-else-if="item.cry === 4">造成2回合的持续伤害效果效果，伤害为对方攻的{{6*item.star}}%，如果卡牌为暗则伤害为攻的{{6.5*item.star}}%</span>
                      <span v-else-if="item.cry === 5">造成2回合的持续伤害效果，伤害为对方攻的{{6*item.star}}%，如果卡牌为光则伤害为攻的{{6.5*item.star}}%</span>
                    </p>
                  </div>
                  <i class="el-icon-info pl5 pr5 wm_battlecard_cardtip_ico"
                     slot="reference"></i>
                </el-popover>
              </div>
              <div class="wm_battlecard_list_number"
                   @click="selcard(index,$event)">{{index+1}}</div>
              <div v-if="item!==null"><img class="wm_getcard_img"
                     :src="$wikimoecard.url+item.packageId+'/'+item.cardId+'.jpg'"></div>
            </div>
          </draggable>
        </div>
      </div>
    </el-collapse-transition>
    <div class="wm_battlecard_usercard"
         v-show="selIndex!==null">
      <div class="wm_cardlist_select_search_body">
        <el-form :inline="true"
                 :model="searchForm">
          <el-form-item label="选择卡包">
            <el-select v-model="seledCardPackage"
                       placeholder="选择卡包"
                       class="wm_cardlist_select"
                       @change="getMycard">
              <el-option v-for="item in cardPackage"
                         :key="item.packageId"
                         :label="item.name"
                         :value="item.packageId">
                <span>{{item.name}}({{cardCount[item.packageId] || 0}}/{{item.oneStar+item.twoStar+item.threeStar+item.fourStar+item.fiveStar+item.sixStar}})</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="星星等级">
            <el-select class="wm_cardlist_select"
                       @change="searchChanged"
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
                       @change="searchChanged"
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
                       @change="searchChanged"
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
                       @change="searchChanged"
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
          <el-form-item label="设置排序">
            <el-select class="wm_cardlist_select"
                       @change="searchChanged"
                       v-model="searchForm.sort"
                       placeholder="设置排序">
              <el-option label="默认"
                         value="0"></el-option>
              <el-option label="等级从高到低"
                         value="1"></el-option>
              <el-option label="等级从低到高"
                         value="2"></el-option>
              <el-option label="星级从高到低"
                         value="3"></el-option>
              <el-option label="星级从低到高"
                         value="4"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <el-collapse-transition>
        <div class="wm_mycard_list"
             v-if="userCard.length>0">
          <div class="wm_market_mycard_item type_mobile"
               v-for="(item,index) in userCard"
               v-bind:key="index"
               :class="ifCardId===item.cardId?'card_sel_pikapika':''">
            <img class="wm_getcard_img"
                 :src="$wikimoecard.url+item.packageId+'/'+item.cardId+'.jpg'"
                 @click="seledCard(item.cardId,item)">
            <div class="wm_battlecard_level cRed">Lv.{{myCardLevel[item.cardId]?myCardLevel[item.cardId]+1:1}}</div>
            <div class="wm_battlecard_cardtip cRed"
                 v-if="item">
              <el-popover placement="top"
                          width="300"
                          trigger="click">
                <div class="wm_battlecard_cardtip_body">
                  <p v-if="item.cry === 1">
                    <span>【红火】</span><br>
                    <span>与蓝水卡牌对战时会处于劣势，与绿风卡牌对战时会处于优势</span>
                  </p>
                  <p v-else-if="item.cry === 2">
                    <span>【蓝水】</span><br>
                    <span>与绿风卡牌对战时会处于劣势，与红火卡牌对战时会处于优势</span>
                  </p>
                  <p v-else-if="item.cry === 3">
                    <span>【绿风】</span><br>
                    <span>与红火卡牌对战时会处于劣势，与蓝水卡牌对战时会处于优势</span>
                  </p>
                  <p v-else-if="item.cry === 4">
                    <span>【光】</span><br>
                    <span>与暗卡牌相互克制</span>
                  </p>
                  <p v-else-if="item.cry === 5">
                    <span>【暗】</span><br>
                    <span>与光卡牌相互克制</span>
                  </p>

                  <p v-if="item.leftType === 1">
                    <span>【全能】</span><br>
                    <span>攻+{{50*(myCardLevel[item.cardId]?myCardLevel[item.cardId]+1:1)}}、防+{{25*(myCardLevel[item.cardId]?myCardLevel[item.cardId]+1:1)}}</span>
                  </p>
                  <p v-else-if="item.leftType === 2">
                    <span>【兵攻】</span><br>
                    <span>攻+{{100*(myCardLevel[item.cardId]?myCardLevel[item.cardId]+1:1)}}</span>
                  </p>
                  <p v-else-if="item.leftType === 3">
                    <span>【盾防】</span><br>
                    <span>防+{{50*(myCardLevel[item.cardId]?myCardLevel[item.cardId]+1:1)}}</span>
                  </p>
                  <p v-else-if="item.leftType === 4">
                    <span>【速度】</span><br>
                    <span>速+{{1*(myCardLevel[item.cardId]?myCardLevel[item.cardId]+1:1)}}</span>
                  </p>
                  <p v-else-if="item.leftType === 5">
                    <span>【爱心】</span><br>
                    <span>SAN+{{1150*(myCardLevel[item.cardId]?myCardLevel[item.cardId]+1:1)}}</span>
                  </p>

                  <p v-if="item.rightType === 1">
                    <span>【物】</span><br>
                    <span>攻击增加{{9*item.star}}%，并转换为物理攻击，攻防不会受到属性加减</span>
                  </p>
                  <p v-else-if="item.rightType === 2">
                    <span>【魔】</span><br>
                    <span>攻击增加{{9*item.star}}%，并转换为强力魔法攻击，攻防会很大程度受到属性影响</span>
                  </p>
                  <p v-else-if="item.rightType === 3">
                    <span>【防】</span><br>
                    <span>抵消{{10*item.star}}%*的伤害，并造成防御力的{{40*item.star}}%的攻击</span>
                  </p>
                  <p v-else-if="item.rightType === 4">
                    <span>【治】</span><br>
                    <span>解除异常状态，恢复攻的{{8*item.star}}%的SAN，接下来2回合恢复攻的{{4*item.star}}%的SAN</span>
                  </p>
                  <p v-else-if="item.rightType === 5">
                    <span>【妨】</span><br>
                    <span>使对方技能无效，概率为{{16*item.star}}%，降低对方{{10*(7-item.star)}}%的防御</span>
                  </p>
                  <p v-else-if="item.rightType === 6">
                    <span>【支】</span><br>
                    <span>下回合攻击增加{{11*item.star}}%*星级，防御力增加{{2*item.star}}%</span>
                  </p>
                  <p v-else-if="item.rightType === 7">
                    <span>【特】</span><br>
                    <span v-if="item.cry === 1">造成2回合持续伤害效果，伤害为攻的{{6*item.star}}%，如果卡牌为绿风则伤害为攻的{{6.5*item.star}}%</span>
                    <span v-else-if="item.cry === 2">造成2回合持续伤害效果，伤害为攻的{{6*item.star}}%，如果卡牌为红火则伤害为攻的{{6.5*item.star}}%</span>
                    <span v-else-if="item.cry === 3">造成2回合持续伤害效果，伤害为攻的{{6*item.star}}%，如果卡牌为蓝水则伤害为攻的{{6.5*item.star}}%</span>
                    <span v-else-if="item.cry === 4">造成2回合的持续伤害效果效果，伤害为对方攻的{{6*item.star}}%，如果卡牌为暗则伤害为攻的{{6.5*item.star}}%</span>
                    <span v-else-if="item.cry === 5">造成2回合的持续伤害效果，伤害为对方攻的{{6*item.star}}%，如果卡牌为光则伤害为攻的{{6.5*item.star}}%</span>
                  </p>
                </div>
                <i class="el-icon-info pl5 pr5 wm_battlecard_cardtip_ico"
                   slot="reference"></i>
              </el-popover>
            </div>
          </div>
        </div>
        <div class="wm_battlecard_nocard"
             v-if="userCard.length<=0&&!pageChangeing">您目前还没有这些卡牌呢！快去抽卡！</div>
      </el-collapse-transition>
      <div class="wm_market_content_page"
           v-if="userCard.length>0">
        <el-pagination small
                       layout="prev, pager, next"
                       :total="cardTotle"
                       @current-change="cardPageChange"
                       :current-page.sync="cardPage"
                       :page-size="20"
                       class="my_card_page">
        </el-pagination>
      </div>
    </div>
    <div class="wm_battlecard_btn_body">
      <el-button @click="back();">返回</el-button>
      <el-button type="primary"
                 v-show="selIndex===null"
                 @click="saveCard">保存</el-button>
      <el-dropdown class="ml10"
                   trigger="click"
                   @command="moreBtn">
        <el-button type="info">
          更多
        </el-button>
        <el-dropdown-menu slot="dropdown"
                          placement="top"
                          class="wm_battlecard_more">
          <el-dropdown-item command="shuoming">说明</el-dropdown-item>
          <el-dropdown-item command="clear">清空</el-dropdown-item>
          <el-dropdown-item command="goup">升级</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <menuView></menuView>
    <el-dialog title="配卡说明"
               :visible.sync="tipDialog"
               class="reg_code_dialog"
               :lock-scroll="false"
               :close-on-click-modal="false"
               width="100%">
      <div>
        <hooper class="wm_battlecard_watch_hooper">
          <slide>
            <div class="wm_battlecard_watch_tips"><img src="/static/battlecardTip/1.jpg" /></div>
          </slide>
          <slide>
            <div class="wm_battlecard_watch_tips"><img src="/static/battlecardTip/2.jpg" /></div>
          </slide>
          <slide>
            <div class="wm_battlecard_watch_tips"><img src="/static/battlecardTip/3.jpg" /></div>
          </slide>
          <slide>
            <div class="wm_battlecard_watch_tips"><img src="/static/battlecardTip/4.jpg" /></div>
          </slide>
          <slide>
            <div class="wm_battlecard_watch_tips"><img src="/static/battlecardTip/5.jpg" /></div>
          </slide>
          <slide>
            <div class="wm_battlecard_watch_tips"><img src="/static/battlecardTip/6.jpg" /></div>
          </slide>
          <hooper-pagination slot="hooper-addons"
                             mode="fraction"></hooper-pagination>
        </hooper>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="tipDialog = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import menuView from '../components/menu.vue';
import { PrefixInteger, md5Check, scrollToTop, packageSort } from "../../utils/utils";
import { authApi } from "../api";
import userTop from '../components/topUserInfo.vue';
import md5_ from 'js-md5';
import draggable from 'vuedraggable';
import {
  Hooper,
  Slide,
  Pagination as HooperPagination
} from 'hooper';
import 'hooper/dist/hooper.css';

export default {
  data () {
    return {
      cardCount: {},
      tipDialog: false,
      fixedTable: false,
      cardIndexCount: 0,
      ifCardId: null,//当前暂时选择的卡ID
      ifADSHPSUM: [0, 0, 0, 0],//暂时卡组的增减差
      token: sessionStorage.getItem("token") ? sessionStorage.getItem("token") : localStorage.getItem("token"),
      myCard: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],//卡牌
      selIndex: null,
      userCardCache: [],
      cardPage: 1,
      cardTotle: 0,
      userCard: [],
      pageChangeing: false,
      ADSHP: [0, 0, 0, 0],
      searchForm: {
        star: '0',
        cry: '0',
        rightType: '0',
        leftType: '0',
        sort: '0'
      },
      myCardLevel: {},
      myBattleCardLevel: {},
      seledCardPackage: '-1',
      cardPackage: [{
        name: "加载中...",
        packageId: "-1"
      }],
    }
  },
  components: {
    menuView,
    userTop,
    draggable,
    Hooper,
    Slide,
    HooperPagination
  },
  created () {
    this.searchCardCount();
    this.getCardPackage();
  },
  mounted () {
    this.$emit('l2dMassage', '这里可以组建自己的对战卡牌，只有拥有了20张卡牌才可以组建哦！推荐第一次的玩家点击【更多→说明】来查看对战规则哦！');
    window.addEventListener('scroll', this.tableFixed);
  },
  methods: {
    searchCardCount () {
      authApi.searchCardCount({ token: this.token }).then(res => {
        console.log(res);
        if (res.data.code === 1) {
          this.cardCount = res.data.cardCount
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
          if (this.cardPackage.length > 0 && this.seledCardPackage === "-1") {
            this.seledCardPackage = this.cardPackage[0].packageId;
          };
          this.getMyBattleCard();
        }
      });
    },
    moreBtn (command) {
      if (command === 'shuoming') {
        this.openTips();
      } else if (command === 'clear') {
        this.clearBattleCard();
      } else if (command === 'goup') {
        this.$router.push({
          path: '/upgradecard'
        });
      }
    },
    clearBattleCard () {
      this.myCard = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
      this.ADSHP = this.sumADSHP(this.myCard);
      this.restIf();
    },
    tableFixed () {
      let el = document.getElementById('battlecardTable');
      if (!el) {
        return false;
      }
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      let offsetTop = el.offsetTop;
      scrollTop > offsetTop ? this.fixedTable = true : this.fixedTable = false;
    },
    openTips () {
      // this.$alert('<div class="watch_tips"><img src="/static/otherImg/battletips.png" /></div>', '配卡说明', {
      //   dangerouslyUseHTMLString: true,
      //   lockScroll: false
      // });
      this.tipDialog = true;
    },
    saveCard () {
      let params = {
        token: this.token,
        type: 'save',
        card: this.myCard
      }
      authApi.battlecard(params).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.$message({
            message: res.data.msg,
            type: 'success'
          });
        }
      });
    },
    sumADSHP (getCardArr) {
      let myCardInfo = getCardArr.filter((item) => {
        return item !== null;
      });
      console.log(myCardInfo);
      // let cardList = cardArr;
      // for(let i=0;i<cardList.length;i++){
      //     if(cardList[i]!==null){
      //         let cardInfo = cardData_[cardList[i]];
      //         cardInfo['cardId'] = cardList[i];
      //         myCardInfo.push(cardInfo);
      //     }
      // }
      let cardArr = myCardInfo;
      let starArr = [0, 0, 0, 0, 0, 0];
      let starCount = 0;
      let cryArr = [0, 0, 0, 0, 0];
      for (let i = 0; i < cardArr.length; i++) {
        let star = cardArr[i].star - 1;
        starArr[star] = starArr[star] + 1;
        starCount = starCount + star + 1;
        let cry = cardArr[i].cry - 1;
        cryArr[cry] = cryArr[cry] + 1;
      }
      let x = starCount;//初始化x为星星的数量
      console.log(x);
      // 如果是1、2、3、4、5、6顺子排列的卡牌则攻击力和防御力和血的x+20
      let minStarCount = Math.min.apply(null, starArr);
      if (minStarCount > 2) {
        minStarCount = 2;
      }
      let cardCountPlus = 0;
      cardCountPlus = Math.floor(this.cardIndexCount / 25);//每25收集率x+1
      x = x + minStarCount * 20 + cardCountPlus;
      // 每三种同属性的卡牌攻击力和防御力和血的x+1
      // for(let i=0;i<cryArr.length;i++){
      //     let cryPlusX = Math.floor(cryArr[i]/3);
      //     x = x + cryPlusX;
      // }
      // 攻击=x*100 防=x*50 血=x*200
      let A = x * 100;
      let D = x * 50;
      let HP = x * 1150;
      console.log(cardCountPlus);
      // 设置速度
      let S = 0;
      for (let j = 0; j < cardArr.length; j++) {
        //速4
        let leftType = cardArr[j].leftType;
        let level = this.myCardLevel[cardArr[j].cardId] || 0;
        if (leftType === 4) {
          S = S + 1 + level * 1;
        } else if (leftType === 1) {//全1
          A = A + 50 + level * 50;
          D = D + 25 + level * 25;
        } else if (leftType === 2) {//兵2
          A = A + 100 + level * 100;
        } else if (leftType === 3) {//盾3
          D = D + 50 + level * 50;
        } else if (leftType === 5) {//爱5
          HP = HP + 1150 + level * 1150;
        }
      }
      return [A, D, S, HP];
    },
    seledCard (i, item) {
      if (i === this.ifCardId) {
        //选中该卡
        this.myCard[this.selIndex] = item;
        this.selIndex = null;
        this.ADSHP = this.sumADSHP(this.myCard);
        this.restIf();
      } else {
        //选择该卡（闪亮）
        this.ifCardId = i;
        //复制一下原有的卡组
        let cardCache = [...this.myCard];
        //将其替换成现在的卡
        cardCache[this.selIndex] = item;
        let ifADSHP = this.sumADSHP(cardCache);
        for (let i = 0; i < ifADSHP.length; i++) {
          this.ifADSHPSUM[i] = ifADSHP[i] - this.ADSHP[i];
        }
      }
    },
    restIf () {
      this.ifCardId = null;
      this.ifADSHPSUM = [0, 0, 0, 0]
    },
    selcard (i, e) {
      console.log(e);
      this.cardPage = 1;
      this.cardPageChange(1);
      this.selIndex = i;
      scrollToTop(0, 200);
    },
    PrefixInteger_ (num, length) {
      return PrefixInteger(num, length);
    },
    searchChanged () {
      this.restIf();
      this.cardPage = 1;
      this.cardPageChange(1);
    },
    cardPageChange (val) {
      this.pageChangeing = true;
      this.userCard = [];
      let that = this;
      // 筛选条件
      function setStar (item) {
        let p_ = that.searchForm.star;
        if (p_ === '0') {
          return true;
        } else if (item == p_) {
          return true;
        }
        return false;
      }
      function setCry (item) {
        let p_ = that.searchForm.cry;
        if (p_ === '0') {
          return true;
        } else if (item == p_) {
          return true;
        }
        return false;
      }
      function setRightType (item) {
        let p_ = that.searchForm.rightType;
        if (p_ === '0') {
          return true;
        } else if (item == p_) {
          return true;
        }
        return false;
      }
      function setLeftType (item) {
        let p_ = that.searchForm.leftType;
        if (p_ === '0') {
          return true;
        } else if (item == p_) {
          return true;
        }
        return false;
      }
      function seledCard (item) {
        let nohaveId = true;
        for (let i = 0; i < that.myCard.length; i++) {
          if (that.myCard[i] !== null) {
            if (item == that.myCard[i].cardId) {
              //如果有一样的卡牌ID
              nohaveId = false;
              break;
            }
          }
        }
        return nohaveId;
      }
      function setSort (a, b) {
        let sort_ = that.searchForm.sort;
        if (sort_ === '0') {
          if (a.star < b.star) {
            return 1;
          } else if (a.star > b.star) {
            return -1;
          } else {
            if ((that.myCardLevel[a.cardId] || 0) < (that.myCardLevel[b.cardId] || 0)) {
              return 1;
            } else if ((that.myCardLevel[a.cardId] || 0) > (that.myCardLevel[b.cardId] || 0)) {
              return -1;
            } else {
              return b.cardId - a.cardId;
            }
          }
        } else if (sort_ === '1') {
          if ((that.myCardLevel[a.cardId] || 0) < (that.myCardLevel[b.cardId] || 0)) {
            return 1;
          } else if ((that.myCardLevel[a.cardId] || 0) > (that.myCardLevel[b.cardId] || 0)) {
            return -1;
          } else {
            return b.cardId - a.cardId;
          }
        } else if (sort_ === '2') {
          return (that.myCardLevel[a.cardId] || 0) - (that.myCardLevel[b.cardId] || 0);
        } else if (sort_ === '3') {
          if (a.star < b.star) {
            return 1;
          } else if (a.star > b.star) {
            return -1;
          } else {
            return b.cardId - a.cardId;
          }
        } else if (sort_ === '4') {
          return a.star - b.star;
        }
      }
      console.log(this.userCardCache);
      let userCardSearchRes = this.userCardCache.filter(item => setStar(item.star) && setCry(item.cry) && setRightType(item.rightType) && setLeftType(item.leftType) && seledCard(item.cardId));
      userCardSearchRes = userCardSearchRes.sort(setSort);
      let userCard_ = userCardSearchRes.slice((val - 1) * 20, val * 20);
      this.cardTotle = userCardSearchRes.length;
      setTimeout(() => {
        this.userCard = userCard_;
        this.pageChangeing = false;
      }, 300)
    },
    getMyBattleCard () {
      let params = {
        token: this.token,
        type: 'search'
      }
      authApi.battlecard(params).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          if (res.data.data.length === 20) {
            let myBattleCardData = res.data.data;
            let myBattleCardId = res.data.cardId;
            Object.assign(this.myCardLevel, res.data.cardLevelData);
            // 让数据按照卡组顺序排列
            myBattleCardData.sort((a, b) => {
              if (myBattleCardId.indexOf(a.cardId) === -1 && myBattleCardId.indexOf(b.cardId) === -1) {
                return 1
              } else if (myBattleCardId.indexOf(a.cardId) !== -1 && myBattleCardId.indexOf(b.cardId) === -1) {
                return -1
              } else if (myBattleCardId.indexOf(a.cardId) === -1 && myBattleCardId.indexOf(b.cardId) !== -1) {
                return 1
              }
              return myBattleCardId.indexOf(a.cardId) - myBattleCardId.indexOf(b.cardId)
            })
            this.myCard = myBattleCardData;
            this.myBattleCardLevel = res.data.cardLevelData || {};
          }
          // this.searchcardlevel();
          this.getMycard();
        }
      });
    },
    searchcardlevel () {
      let params = {
        token: this.token
      }
      authApi.searchcardlevel(params).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          if (res.data.data) {
            Object.assign(this.myCardLevel, res.data.data);
          }
          this.getMycard();
        }
      });
    },
    getMycard () {
      authApi.searchcardbytoken({ token: this.token, packageId: this.seledCardPackage }).then(res => {
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          let resData = res.data;
          this.cardIndexCount = res.data.cardIndexCount || 0;
          // this.myCardLevel = res.data.cardLevelData;
          Object.assign(this.myCardLevel, res.data.cardLevelData);
          if (res.data.cardIndexCount > 0) {
            this.userCardCache = res.data.card || [];
            this.cardPage = 1;
            this.ADSHP = this.sumADSHP(this.myCard);
            this.cardPageChange(1);
          } else {
            this.$message({
              message: resData.nickName + '还没有获得过卡牌呢！',
              type: 'warning'
            });
          }
        }
      });
    },
    back () {
      if (this.selIndex === null) {
        this.$router.push({
          path: '/battle'
        });
      } else {
        this.selIndex = null;
        this.restIf();
      }
    },
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.tableFixed);
  }
}
</script>

<style scoped>
.wm_user_info_table.type_battlecard th {
  width: 25%;
}
.wm_user_info_table.type_battlecard td {
  width: 25%;
}
.wm_battlecard_btn_body {
  padding: 20px 0;
  text-align: center;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}
.wm_battlecard_body {
  text-align: center;
}
.wm_battlecard_list_box {
  cursor: url(/static/cur/pointer.cur), pointer;
  margin: 5px;
  display: inline-block;
  text-align: center;
  width: 180px;
  height: 253px;
  border-radius: 4px;
  border: 1px dashed #ccc;
  position: relative;
}
.wm_battlecard_list_number {
  line-height: 253px;
  font-size: 36px;
  position: absolute;
  left: 1px;
  right: 1px;
  top: 1px;
  bottom: 1px;
  color: #ccc;
  text-shadow: #fff 1px 0 0, #fff 0 1px 0, #fff -1px 0 0, #fff 0 -1px 0;
  opacity: 0.8;
  z-index: 2;
}
.wm_battlecard_nocard {
  padding: 50px 0;
  text-align: center;
}
.wm_battlecard_list_move {
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  width: 20px;
  height: 20px;
  line-height: 20px;
  right: 5px;
  bottom: 5px;
  border-radius: 3px;
  cursor: url(/static/cur/move.cur), move;
  z-index: 3;
  border: 1px solid rgba(255, 83, 100, 0.6);
}
.wm_battlecard_level {
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  padding: 0 5px;
  height: 20px;
  line-height: 20px;
  left: 5px;
  bottom: 5px;
  border-radius: 3px;
  z-index: 3;
  border: 1px solid rgba(255, 83, 100, 0.6);
}
.wm_battlecard_cardtip {
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  height: 20px;
  line-height: 20px;
  left: 5px;
  bottom: 30px;
  border-radius: 3px;
  z-index: 3;
  border: 1px solid rgba(255, 83, 100, 0.6);
}
.wm_battlecard_cardtip_ico {
  height: 100%;
  line-height: 20px;
}
.wm_battlecard_cardtip_body p {
  margin-bottom: 5px;
}
.wm_battlecard_table_fixed_body {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 10;
  background: #fff;
  padding: 60px 10px 0px 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}
.wm_battlecard_table_fixed_box {
  margin: 0 auto;
  width: 100%;
  max-width: 980px;
}
.wm_battlecard_watch_tips {
  height: 100%;
  text-align: center;
}
.wm_battlecard_watch_tips img {
  max-width: 100%;
  max-height: 100%;
  height: auto;
  width: auto;
}
@media (max-width: 768px) {
  .wm_battlecard_list_box {
    width: 88px;
    height: 124px;
  }
  .wm_battlecard_list_number {
    line-height: 124px;
  }
}
</style>
<style>
.wm_battlecard_more .popper__arrow {
  display: none;
}
.wm_battlecard_watch_hooper .hooper-pagination {
  bottom: -30px;
}
</style>