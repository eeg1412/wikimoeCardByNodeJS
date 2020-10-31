<template>
  <div class="wmcard_admincenter_common_right_body">
    <div class="mb15">
      <div class="dib"
           v-show="showMode === 'card'">
        <el-button type="primary"
                   size="mini"
                   icon="el-icon-s-unfold"
                   @click="showModeChange('table')"></el-button>
      </div>
      <div class="dib"
           v-show="showMode === 'table'">
        <el-button type="primary"
                   size="mini"
                   icon="el-icon-s-grid"
                   @click="showModeChange('card')"></el-button>
      </div>
    </div>
    <el-table :data="tableData"
              v-if="showMode === 'table'"
              style="width: 100%"
              current-row-key="_id">
      <el-table-column prop="email"
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
                       :key="item.packageId"
                       :label="item.name"
                       :value="item.packageId">
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
                     @keydown.enter.native.prevent
                     size="small"
                     @click="checkUCC(true,scope.row._id,scope.row.packageId)"
                     v-if="scope.row.check === 0">通过</el-button>
          <el-button type="text"
                     @keydown.enter.native.prevent
                     size="small"
                     @click="checkUCC(false,scope.row._id,scope.row.packageId)"
                     v-if="scope.row.check === 0">驳回</el-button>
          <el-tooltip placement="left"
                      v-if="scope.row.check === 0">
            <div slot="content"><img :src="'/userCreatCard/'+scope.row._id+'.jpg'"
                   class="wm_admin_cardpass_watchcard" /></div>
            <el-button type="text"
                       @keydown.enter.native.prevent
                       size="small"
                       @click="watchCard('/userCreatCard/'+scope.row._id+'.jpg')">卡面</el-button>
          </el-tooltip>
          <el-tooltip placement="left"
                      v-if="scope.row.check === 1&&scope.row.pass===1">
            <div slot="content"><img :src="'/card/'+scope.row.packageId+'/'+scope.row.cardId+'.jpg'"
                   class="wm_admin_cardpass_watchcard" /></div>
            <el-button type="text"
                       @keydown.enter.native.prevent
                       size="small"
                       @click="watchCard('/card/'+scope.row.packageId+'/'+scope.row.cardId+'.jpg')">卡面</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div class="tc wm_admin_cardpass_item_body"
         v-if="showMode === 'card'">
      <el-card class="dib m5 wm_admin_cardpass_item_box"
               :class="{'nopass':item.check === 1&&item.pass===0,'passed':item.check === 1&&item.pass===1,'nocheck':item.check === 0}"
               v-for="(item,index) in tableData"
               :key="index">
        <div class="wm_admin_cardpass_item">
          <div class="wm_admin_cardpass_item_img_body">
            <div v-if="item.check === 0"
                 key="creatCard">
              <img class="wm_admin_cardpass_item_img"
                   :src="'/userCreatCard/'+item._id+'.jpg'"
                   :key="item._id" />
            </div>
            <div v-else-if="item.check === 1&&item.pass===1"
                 key="packageCard">
              <img class="wm_admin_cardpass_item_img"
                   :src="'/card/'+item.packageId+'/'+item.cardId+'.jpg'"
                   :key="item._id" />
            </div>
            <div v-else
                 key="nocard">
              <img class="wm_admin_cardpass_item_img"
                   src="/static/img/back.jpg"
                   :key="item._id" />
            </div>
          </div>

          <div class="wm_admin_cardpass_item_info_box tl"
               v-if="!item.likeCard">
            <p><span class="dib wm_admin_cardpass_item_info_label">邮箱：</span> {{item.email}}</p>
            <p><span class="dib wm_admin_cardpass_item_info_label">昵称：</span> {{item.nickName}}</p>
            <p><span class="dib wm_admin_cardpass_item_info_label">卡牌名：</span> {{item.name}}</p>
            <p><span class="dib wm_admin_cardpass_item_info_label">出处：</span> {{item.title}}</p>
            <p><span class="dib wm_admin_cardpass_item_info_label">星级：</span> {{item.star}}</p>
            <p><span class="dib wm_admin_cardpass_item_info_label">被动属性：</span> {{item.leftType | leftType}}(<img :src="'/static/otherImg/creatcard/leftType/'+item.leftType+'.png'"
                   width="16px"
                   height="16px">)</p>
            <p><span class="dib wm_admin_cardpass_item_info_label">主动技能：</span> {{item.rightType | rightType}}(<img :src="'/static/otherImg/creatcard/rightType/'+item.rightType+'.png'"
                   width="16px"
                   height="16px">)</p>
            <p><span class="dib wm_admin_cardpass_item_info_label">水晶：</span> {{item.cry | cry}}(<img :src="'/static/otherImg/creatcard/cry/'+item.cry+'.png'"
                   width="16px"
                   height="16px">)</p>
            <p><span class="dib wm_admin_cardpass_item_info_label">卡包：</span>
              <el-select v-model="item.packageId"
                         placeholder="选择卡包"
                         class="wm_card_package_sel"
                         :disabled="item.check?true:false">
                <el-option v-for="itemp in packageData"
                           :key="itemp.packageId"
                           :label="itemp.name"
                           :value="itemp.packageId">
                </el-option>
              </el-select>
            </p>
            <p><span class="dib wm_admin_cardpass_item_info_label">审核：</span>
              <!-- <el-tag type="success"
                      v-if="item.check"
                      key="checked">已审核</el-tag> -->
              <el-tag type="danger"
                      v-if="!item.check"
                      key="nocheck">未审核</el-tag>
              <el-tag type="success"
                      v-else-if="item.pass"
                      key="pass">已通过</el-tag>
              <el-tag type="info"
                      v-else
                      key="nopass">未通过</el-tag>
            </p>
          </div>
          <div class="wm_admin_cardpass_item_like_box tl"
               v-if="item.likeCard">
            <div class="wm_admin_cardpass_item_like_keyword">
              <el-input placeholder="请输入内容"
                        size="mini"
                        v-model="item.likeKeyWord"
                        class="input-with-select">
                <el-button slot="append"
                           icon="el-icon-search"
                           @click="reSearchLikeCard(index)"></el-button>
              </el-input>
            </div>
            <div class="mt5 mb5 wm_admin_cardpass_item_likecardlst_box">
              <el-row :gutter="5">
                <el-col :span="6"
                        v-for="(card ,index) in item.likeCardList"
                        :key="card._id + index"
                        class="mb5">
                  <div>
                    <el-tooltip placement="right"
                                :enterable="false"
                                :open-delay="300"
                                :key="card._id">
                      <div slot="content"><img :src="$wikimoecard.url+card.packageId+'/'+card.cardId+'.jpg'"
                             class="wm_admin_cardpass_watchcard" /></div>
                      <img :src="$wikimoecard.url+card.packageId+'/'+card.cardId+'.jpg'"
                           width="100%"
                           :key="card.cardId">
                    </el-tooltip>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div>
              <!-- @current-change="cardPageChange" -->
              <el-pagination small
                             layout="prev, pager, next"
                             :total="item.likeTotal"
                             :current-page.sync="item.likePage"
                             @current-change="likeCardPage($event,index)"
                             :pager-count="5"
                             :page-size="50">
              </el-pagination>
            </div>
          </div>
        </div>
        <div class="wm_admin_cardpass_item_info_btn_body mt10 tr">
          <el-button @keydown.enter.native.prevent
                     size="mini"
                     type="info"
                     v-show="!item.likeCard"
                     @click="openLikeCard(index)">查询同名卡牌</el-button>
          <el-button @keydown.enter.native.prevent
                     size="mini"
                     type="info"
                     v-show="item.likeCard"
                     @click="openInfo(index)">查看卡牌信息</el-button>
          <el-button @keydown.enter.native.prevent
                     size="mini"
                     type="primary"
                     @click="checkUCC(true,item._id,item.packageId)"
                     v-if="item.check === 0">通过</el-button>
          <el-button @keydown.enter.native.prevent
                     size="mini"
                     @click="checkUCC(false,item._id,item.packageId)"
                     v-if="item.check === 0">驳回</el-button>
        </div>
      </el-card>
    </div>
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
import { packageSort } from "../../../../utils/utils";
export default {
  data () {
    return {
      showMode: "card",
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
    showModeChange (type) {
      console.log(this.showMode, type);
      this.showMode = type;
      console.log(this.showMode);
    },
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
      authApi.searchcardpackage({ all: true, sortType: "default" }).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.packageData = res.data.data;
          // 给卡包排序
          this.packageData = packageSort(this.packageData, res.data.sortData, "default");
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
          lockScroll: false,
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
    adminSearchcard (params, i) {
      authApi.adminSearchcard(params).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.tableData[i]["likeCardList"] = res.data.data;
          this.tableData[i]["likeTotal"] = res.data.totle;
        }
      });
    },
    openLikeCard (i) {
      this.tableData[i]["likePage"] = 1;
      this.tableData[i]["likeCard"] = true;
      const params = {
        star: '0',
        cry: '0',
        rightType: '0',
        leftType: '0',
        title: '',
        name: this.tableData[i]["likeKeyWord"],
        token: this.token,
        page: this.tableData[i]["likePage"],
        packageId: '-1'
      };
      this.adminSearchcard(params, i);
    },
    reSearchLikeCard (i) {
      this.tableData[i]["likePage"] = 1;
      const params = {
        star: '0',
        cry: '0',
        rightType: '0',
        leftType: '0',
        title: '',
        name: this.tableData[i]["likeKeyWord"],
        token: this.token,
        page: this.tableData[i]["likePage"],
        packageId: '-1'
      };
      this.adminSearchcard(params, i);
    },
    likeCardPage (e, i) {
      console.log(e, i);
      const params = {
        star: '0',
        cry: '0',
        rightType: '0',
        leftType: '0',
        title: '',
        name: this.tableData[i]["likeKeyWord"],
        token: this.token,
        page: this.tableData[i]["likePage"],
        packageId: '-1'
      };
      this.adminSearchcard(params, i);
    },
    openInfo (i) {
      this.tableData[i]["likeCard"] = false;
    },
    getUCC () {
      authApi.adminCreatcard({ token: this.token, type: 'get', page: this.page }).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          let tableDataCache = res.data.data;
          tableDataCache.forEach((item, index) => {
            item["likeCard"] = false;
            item["likeKeyWord"] = item.name;
            item["likeCardList"] = [];
            item["likePage"] = 1;
            item["likeTotal"] = 0;
            tableDataCache[index] = item;
          });
          this.tableData = tableDataCache;
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
.wm_admin_cardpass_item_box {
  width: calc(49% - 14px);
  max-width: 850px;
}
.wm_admin_cardpass_item_box.nopass {
  border: 1px solid #000;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.wm_admin_cardpass_item_box.passed {
  border: 1px solid #67c23a;
  box-shadow: 0 2px 12px 0 rgba(103, 194, 58, 0.1);
}
.wm_admin_cardpass_item_box.nocheck {
  border: 1px solid #ff4c4c;
  box-shadow: 0 2px 12px 0 rgba(255, 76, 76, 0.1);
}
.wm_admin_cardpass_item {
  display: flex;
}
.wm_admin_cardpass_item_img {
  width: 100%;
  height: auto;
}
.wm_admin_cardpass_item_info_box .wm_card_package_sel {
  line-height: 26px;
}
.wm_admin_cardpass_item_box .el-input__inner {
  height: 26px;
}
.wm_admin_cardpass_item_box .el-input__icon {
  line-height: 26px;
}
.wm_admin_cardpass_item_box .el-tag {
  height: 26px;
  line-height: 26px;
}
.wm_admin_cardpass_item_box .el-pagination {
  line-height: 18px;
  text-align: center;
}
.wm_admin_cardpass_item_info_box,
.wm_admin_cardpass_item_like_box {
  border-radius: 10px;
  border: 1px solid #ccc;
  padding: 15px;
  box-sizing: border-box;
  margin-left: 10px;
  font-size: 14px;
  line-height: 32px;
  word-break: break-all;
  flex-grow: 1;
}
.wm_admin_cardpass_item_body {
  min-width: 1294px;
  overflow: auto;
}
.wm_admin_cardpass_item_info_label {
  width: 80px;
  font-weight: bold;
}
.wm_admin_cardpass_item_like_keyword {
  width: 100%;
}
.wm_admin_cardpass_item_likecardlst_box {
  height: 356px;
  overflow-y: auto;
  overflow-x: hidden;
}
.wm_admin_cardpass_item_img_body {
  flex-shrink: 0;
  width: 325px;
}
</style>
